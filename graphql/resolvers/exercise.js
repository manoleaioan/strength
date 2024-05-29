const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Exercise = require('../../models/Exercise');
const Routine = require('../../models/Routine');
const User = require('../../models/User');
const Workout = require('../../models/Workout');


module.exports = {
  createExercise: async ({ exerciseInput: { name, type, _id, maxRep, maxVol } }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const user = await User.findOne({ _id: req.userId });

      const exercise = await Exercise.findOneAndUpdate(
        { _id: new ObjectId(_id), user },
        {
          $set: {
            name, type, user, maxRep, maxVol
          }
        },
        { upsert: true, new: true }
      )

      return exercise;
    } catch (err) {
      throw new Error(err);
    }
  },

  deleteExercise: async ({ exerciseId }, { req }) => {
    const session = await mongoose.startSession();

    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const user = await User.findOne({ _id: req.userId })

      await session.withTransaction(async () => {
        await Routine.updateMany(
          {
            user,
            "exercises.superset.exId": { "$in": [exerciseId] }
          },
          {
            $pull: { 'exercises.$[].superset': { exId: exerciseId } },
          },
          { session: session }
        )

        await Routine.updateMany(
          {
            user,
            $or: [
              {
                "exercises.exId": { "$in": [exerciseId] }
              },
              {
                "exercises.superset": { $size: 0 }
              }
            ]
          },
          {
            $pull: {
              'exercises': {
                $or: [
                  { exId: exerciseId },
                  { superset: { $size: 0 } }
                ]
              },
            },
          },
          { session: session }
        )

        await Exercise.deleteOne(
          {
            _id: exerciseId,
            user
          },
          { session: session }
        );
      });

      return exerciseId;
    } catch (err) {
      console.log(err)
      throw new Error(err);
    } finally {
      await session.endSession();
    }
  },

  getExercises: async ({ exerciseId }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      let match = { user: req.userId };
      
      if (exerciseId) {
        match._id = exerciseId
      };

      const result = await Exercise.find(match);
      // await Exercise.syncIndexes();

      return result;
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  },

  getExerciseChartData: async ({ chartDataInput: { exerciseId, period } }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      let startDate;
      let MAX_DATA_POINTS = 200;

      switch (period) {
        case '1W':
          startDate = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '1M':
          startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
          break;
        case '3M':
          startDate = new Date(new Date().setMonth(new Date().getMonth() - 3));
          break;
        case '6M':
          startDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
          break;
        case '1Y':
          startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
          break;
        case 'All':
          startDate = new Date(0); // Unix epoch
          break;
        default:
          throw new Error('Invalid period selection');
      }

      const workouts = await Workout.find({
        $or: [
          { 'exercises.exId._id': exerciseId },
          { 'exercises.superset.exId._id': exerciseId }
        ],
        startDate: {
          $gte: startDate.toISOString()
        },
        $or: [
          { 'exercises.records': { $exists: true } },
          { 'exercises.superset.records': { $exists: true } }
        ],
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
            ...(exercise.exId._id?.toString() == exerciseId && exercise.records || []),
            ...(exercise.superset?.filter(e => e.exId._id.toString() == exerciseId && e.records)?.map(e => e.records).flat() || [])
          ];

          if (flatRecords.length > 0) {
            flatRecords.forEach(records => {
              repSampledData.push({
                date: workout.startDate,
                reps: records.record
              });
            });

            volSampledData.push({
              date: workout.startDate,
              vol: flatRecords.reduce((acc, r) => acc + (r.weight === 0 ? r.record : r.record * r.weight), 0)
            })
          }
        });
      }

      // console.log(repSampledData, volSampledData);

      let result = {
        repsData: repSampledData,
        volData: volSampledData
      };


      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

}