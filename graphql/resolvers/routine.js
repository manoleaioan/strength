const User = require('../../models/User');
const Exercise = require('../../models/Exercise');
const Routine = require('../../models/Routine');
const ObjectId = require('mongodb').ObjectID;

module.exports = {
  createRoutine: async ({ routineInput }, { req }) => {
    try {
      if (!req.isAuth){
        // req.userId = "6186740a5987a60ec0d9dcda"
        throw 'Unauthorized';
      }

      const user = await User.findOne({ _id: req.userId  })

      const { name, color, exercises, _id } = routineInput;

      const routine = await Routine.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            name,  color, exercises, user
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
        
      const result = await Routine.find({ user: req.userId}).populate("exercises.exId exercises.superset.exId").exec();
      // result.map(r=>{
      //   if (r.name === "Abs Workout"){
      //    console.log(r.exercises[5]);
      //   }
      // })
      //await Exercise.deleteMany({});

      return result;
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  }
}