const User = require('../../models/User');
const Exercise = require('../../models/Exercise');
const Routine = require('../../models/Routine');
const Workout = require('../../models/Workout');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  createWorkout: async ({ workoutInput }, { req }) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      const user = await User.findOne({ _id: req.userId });

      const { name, color, exercises, startDate, _id } = workoutInput;

      let workout = await Workout.findById(_id);

      // update workout
      if (workout) {
        workout.name = name;
        workout.color = color;
        workout.user = user;

        if (startDate) {
          workout.startDate = startDate;
        }

        if (exercises) {
          const populatedExercises = await Promise.all(exercises.map(async (exercise) => {
            if (!exercise._id && !exercise.superset) {
              const exDetails = await Exercise.findOne({ _id: exercise?.exId });

              if (exercise.superset && exercise.superset.length > 0) {
                await Promise.all(exercise.superset.map(async (subExercise) => {
                  const subExDetail = await Exercise.findOne({ _id: subExercise.exId._id });
                  if (!subExercise._id) {
                    subExercise.exId = subExDetail;
                  }
                }));
              } else {
                exercise.exId = exDetails;
              }
            }
            return exercise;
          }));

          workout.exercises = populatedExercises;

          // Update exercise maxRep, maxVol and Activity
          if (workoutInput.exerciseRecordUpdated?._id) {
            let findExUpdated = exercises.find(e =>
              e._id === workoutInput.exerciseRecordUpdated._id ||
              (e.superset && e.superset.some(subEx => subEx._id === workoutInput.exerciseRecordUpdated._id))
            );

            if (findExUpdated && findExUpdated.superset) {
              findExUpdated = findExUpdated.superset.find(sub => sub._id === workoutInput.exerciseRecordUpdated._id);
            }

            let mainExercise = await Exercise.findById(findExUpdated?.exId?._id);
            let lastSetReps = findExUpdated.records[findExUpdated.records.length - 1].record;
            let fitnessVolume = findExUpdated.records.reduce((acc, r) => acc + (r.weight === 0 ? r.record : r.record * r.weight), 0);


            if (mainExercise) {
              if (mainExercise.maxRep < lastSetReps) {
                mainExercise.maxRep = lastSetReps;
              }

              if (mainExercise.maxVol < fitnessVolume) {
                mainExercise.maxVol = fitnessVolume;
              }

              mainExercise.activityAt = workoutInput.exerciseRecordUpdated.time;

              await mainExercise.save();
            }
            // console.log(workoutInput.exerciseRecordUpdated, findExUpdated);

          }
        }
      } else {
        //create workout by routine
        if (workoutInput.routineId) {
          let routine = await Routine.findById(workoutInput.routineId).populate("exercises.exId exercises.superset.exId");

          if (!routine) {
            throw new Error('Routine not found');
          }

          const { name, color, exercises } = routine;

          workout = new Workout({
            name,
            color,
            exercises,
            user,
            routineId: workoutInput.routineId,
            startDate: workoutInput.startDate
          });

          //create workout by a prev workout
        } else if (workoutInput.workoutId) {
          let selectedWorkout = await Workout.findById(workoutInput.workoutId);

          if (!selectedWorkout) {
            throw new Error('Workout not found');
          }

          const { name, color, exercises } = selectedWorkout;

          workout = new Workout({
            name,
            color,
            exercises: exercises.map(e => {
              if (e.exId?._id) {
                return {
                  exId: {
                    _id: e.exId._id,
                    name: e.exId.name,
                    type: e.exId.type,
                  }
                }
              } else {
                return {
                  superset: e.superset.map(s => ({
                    exId: {
                      _id: s.exId._id,
                      name: s.exId.name,
                      type: s.exId.type,
                    }
                  }))
                }
              }
            }),
            user,
            routineId: workoutInput.routineId,
            startDate: workoutInput.startDate
          });

          // new workout
        } else {
          workout = new Workout({
            _id,
            name,
            color,
            exercises,
            user,
            startDate
          });
        }
      }

      if (workout.routineId) {
        await Routine.findOneAndUpdate(
          { _id: workout.routineId },
          { $set: { lastWorkoutDate: workout.startDate } }
        );
      }

      await workout.save();

      if (workout.routineId) {
        const [prevWorkout] = await Workout.find({
          routineId: workout.routineId,
          user: req.userId,
          _id: { $ne: workout._id },
          startDate: { $lt: workout.startDate }
        }).sort({ startDate: -1 }).limit(1);

        if (prevWorkout) {
          workout.exercises = await Promise.all(workout.exercises.map(async (e) => {
            if (e.superset?.length > 0) {
              e.superset.forEach(subEx => {
                subEx.prevRecords = prevWorkout.exercises
                  .flatMap(prevEx => prevEx.superset ? prevEx.superset : [prevEx])
                  .find(prevEx => prevEx._id == subEx._id.toString())
                  ?.records;
              });
            } else {
              e.prevRecords = prevWorkout.exercises
                .flatMap(prevEx => prevEx.superset ? prevEx.superset : [prevEx])
                .find(prevEx => prevEx._id == e._id.toString())
                ?.records;
            }
            return e;
          }));
        }
      }

      return workout;
    } catch (err) {
      throw new Error(err);
    }
  },

  createWorkoutprev: async ({ workoutInput }, { req }) => {
    try {
      if (!req.isAuth) {
        throw 'Unauthorized';
      }

      const user = await User.findOne({ _id: req.userId })

      const { name, color, exercises, startDate, _id } = workoutInput;

      let workout;
      if (_id) {
        workout = await Workout.findById(_id);
        if (!workout) {
          throw new Error('Workout not found');
        }
        workout.name = name;
        workout.color = color;
        workout.exercises = exercises;
        workout.user = user;
        workout.startDate = startDate;
      } else {
        workout = new Workout({
          name, color, exercises, user, startDate
        });
      }

      await workout.save();

      // Populate exercises after save
      await workout.populate("exercises.exId exercises.superset.exId").exec();

      return workout;
    } catch (err) {
      throw new Error(err);
    }
  },

  deleteWorkout: async ({ workoutId }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const user = await User.findOne({ _id: req.userId })

      const exercise = await Workout.deleteOne({
        _id: workoutId,
        user
      });

      return workoutId;
    } catch (err) {
      throw new Error(err);
    }
  },

  getWorkouts: async ({ date }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const query = {
        user: req.userId
      };

      if (date) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        query.startDate = {
          $gte: date,
          $lt: nextDay.toISOString(),
        };
      }

      let workouts = await Workout.find(query).exec();

      workouts = await Promise.all(
        workouts.map(async (w) => {
          if (w.routineId) {
            const [prevWorkout] = await Workout.find({
              routineId: w.routineId,
              user: req.userId,
              _id: { $ne: w._id },
              startDate: { $lt: w.startDate }
            }).sort({ startDate: -1 }).limit(1);

            if (prevWorkout) {
              w.exercises = await Promise.all(w.exercises.map(async (e) => {
                if (e.superset?.length > 0) {
                  e.superset.forEach(subEx => {
                    subEx.prevRecords = prevWorkout.exercises
                      .flatMap(prevEx => prevEx.superset ? prevEx.superset : [prevEx])
                      .find(prevEx => prevEx._id == subEx._id.toString())
                      ?.records;
                  });
                } else {
                  e.prevRecords = prevWorkout.exercises
                    .flatMap(prevEx => prevEx.superset ? prevEx.superset : [prevEx])
                    .find(prevEx => prevEx._id == e._id.toString())
                    ?.records;
                }
                return e;
              }));
            }
          }
          return w;
        })
      );

      return workouts;
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  },

  getWorkoutDays: async ({ year, utcOffset }, { req }) => {
    try {
      if (!req.isAuth)
        throw new Error('Unauthorized');

      const startDates = await Workout.aggregate([
        {
          $match: {
            user: ObjectId(req.userId),
            startDate: {
              $gte: `${year}-01-01T00:00:00.000Z`,
              $lte: `${year}-12-31T23:59:59.999Z`,
            }
          }
        },
        {
          $addFields: {
            startDate: { $toDate: "$startDate" }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$startDate", timezone: utcOffset }
            },
            // originalDate: { $push: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$startDate", timezone: "+02:00" } } }
          }
        }
      ]);

      const distinctDates = startDates.map(({ _id }) => (_id));

      return distinctDates;
    } catch (err) {
      console.error("Error occurred:", err);
      throw new Error(err);
    }
  },

  getWorkoutDays_noTZ: async ({ year }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const startDates = await Workout.distinct("startDate", {
        user: req.userId,
        startDate: {
          $gte: `${year}-01-01`,
          $lte: `${year}-12-31T23:59:59.999Z`,
        }
      }).exec();

      return startDates;
    } catch (err) {
      throw new Error(err);
    }
  }
}