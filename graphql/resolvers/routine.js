const User = require('../../models/User');
const Exercise = require('../../models/Exercise');
const Routine = require('../../models/Routine');
const Workout = require('../../models/Workout');
const { default: mongoose } = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

module.exports = {
  createRoutine: async ({ routineInput }, { req }) => {
    try {
      if (!req.isAuth) {
        // req.userId = "6186740a5987a60ec0d9dcda"
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

      routine.exercises.map(r => {
        // console.log(r.exId);
        // r.populate(r.exId);
      })

      // const routine = new Routine({
      //   name, color, exercises, user
      // })
      // const rest = await routine.save();

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
  
  getRoutines: async (_, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const routinesWithWorkoutsAndReps = await Routine.aggregate([
        {
          $match: { user: mongoose.Types.ObjectId(req.userId) }
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
              { "workouts": { $exists: false } } // Handle the case when workouts array is not present
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
            routine: { $first: "$$ROOT" } // Preserve all fields from Routine
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
            workouts: 0 // Exclude the workouts field
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
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  }
}