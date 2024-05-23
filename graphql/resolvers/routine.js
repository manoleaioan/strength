const User = require('../../models/User');
const Exercise = require('../../models/Exercise');
const Routine = require('../../models/Routine');
const Workout = require('../../models/Workout');
const { default: mongoose } = require('mongoose');
const ObjectId = require('mongodb').ObjectId;


const getRoutinesWithMetrics = async (matchCriteria) => {
  const routinesWithWorkoutsAndReps = await Routine.aggregate([
    {
      $match: matchCriteria
    },
    {
      $lookup: {
        from: "workouts",
        localField: "_id",
        foreignField: "routineId",
        as: "workouts"
      }
    },
    {
      $addFields: {
        workoutsComplete: { $size: "$workouts" }
      }
    },
    {
      $unwind: { path: "$workouts", preserveNullAndEmptyArrays: true }
    },
    {
      $unwind: { path: "$workouts.exercises", preserveNullAndEmptyArrays: true }
    },
    {
      $unwind: { path: "$workouts.exercises.records", preserveNullAndEmptyArrays: true }
    },
    {
      $unwind: { path: "$workouts.exercises.superset", preserveNullAndEmptyArrays: true }
    },
    {
      $unwind: { path: "$workouts.exercises.superset.records", preserveNullAndEmptyArrays: true }
    },
    {
      $match: {
        $or: [
          {
            $and: [
              { "workouts": { $exists: true } },
              { "workouts": { $ne: [] } },
              { "workouts.exercises.exId.type": 0 }
            ]
          },
          {
            $and: [
              { "workouts": { $exists: true } },
              { "workouts": { $ne: [] } },
              { "workouts.exercises.superset.exId.type": 0 }
            ]
          },
          { "workouts": { $exists: false } }
        ]
      }
    },
    {
      $group: {
        _id: "$_id",
        totalRepsRecords: {
          $sum: "$workouts.exercises.records.record"
        },
        totalRepsSupersetRecords: {
          $sum: "$workouts.exercises.superset.records.record"
        },
        workoutsComplete: { $first: "$workoutsComplete" },
        routine: { $first: "$$ROOT" }
      }
    },
    {
      $addFields: {
        totalReps: { $add: ["$totalRepsRecords", "$totalRepsSupersetRecords"] }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $mergeObjects: ["$routine", { totalReps: "$totalReps", workoutsComplete: "$workoutsComplete" }] }
      }
    },
    {
      $project: {
        workouts: 0
      }
    }
  ]);

  await Routine.populate(routinesWithWorkoutsAndReps, { path: 'exercises.exId exercises.superset.exId' });

  const MAX_DATA_POINTS = 10;

  for (const r of routinesWithWorkoutsAndReps) {
    const workouts = await Workout.find({
      routineId: r._id,
      $or: [
        { 'exercises.records': { $exists: true } },
        { 'exercises.superset.records': { $exists: true } }
      ]
    }, {
      'exercises.records': 1,
      'exercises.superset.records': 1,
      'startDate': 1,
      'exercises.exId._id': 1,
      'exercises.superset.exId._id': 1
    });

    // Data sampling
    const repSampledData = [];
    const volSampledData = [];
    const samplingInterval = Math.ceil(workouts.length / MAX_DATA_POINTS);

    for (let i = 0; i < workouts.length; i += samplingInterval) {
      const workout = workouts[i];
      workout.exercises.forEach(exercise => {
        const flatRecords = [
          ...(exercise?.records || []),
          ...(exercise.superset?.map(e => e.records).flat() || [])
        ].filter(e => e != null);

        if (flatRecords.length > 0) {
          flatRecords.forEach(record => {
            repSampledData.push({
              date: workout.startDate,
              reps: record.record
            });

            volSampledData.push({
              date: workout.startDate,
              vol: record.weight === 0 ? record.record : record.record * record.weight
            });
          });
        }
      });
    }

    r.chartData = volSampledData;
  }
  return routinesWithWorkoutsAndReps;
}

module.exports = {
  createRoutine: async ({ routineInput }, { req }) => {
    try {
      if (!req.isAuth) {
        throw 'Unauthorized';
      }

      const user = await User.findOne({ _id: req.userId })

      const { name, color, exercises, _id } = routineInput;

      const routine = await Routine.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            name, color, exercises, user
          }
        },
        { upsert: true, new: true }
      ).populate("exercises.exId exercises.superset.exId");

      return routine;
    } catch (err) {
      throw new Error(err);
    }
  },

  deleteRoutine: async ({ routineId }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const user = await User.findOne({ _id: req.userId })

      const exercise = await Routine.deleteOne({
        _id: routineId,
        user
      });

      return routineId;
    } catch (err) {
      throw new Error(err);
    }
  },

  getRoutines: async ({ routineId }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const matchCriteria = { user: mongoose.Types.ObjectId(req.userId) };

      if (routineId) {
        matchCriteria._id = mongoose.Types.ObjectId(routineId);
      }

      return await getRoutinesWithMetrics(matchCriteria);
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  }
}