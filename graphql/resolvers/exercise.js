const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Exercise = require('../../models/Exercise');
const Routine = require('../../models/Routine');
const User = require('../../models/User');


module.exports = {
  createExercise: async ({ exerciseInput: { name, type, _id } }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const user = await User.findOne({ _id: req.userId })

      const exercise = await Exercise.findOneAndUpdate(
        { _id: new ObjectId(_id), user },
        {
          $set: {
            name, type, user
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

  getExercises: async (_, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const result = await Exercise.find({ user: req.userId });

      return result;
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  }
}