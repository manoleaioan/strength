const { default: mongoose } = require('mongoose');
const Workout = require('../../models/Workout');
const Routine = require('../../models/Routine');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  getMetrics: async ({ date }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const query = {
        user: mongoose.Types.ObjectId(req.userId)
      };

      query.startDate = {
        $gt: date.gt,
        ...(date.lte && { $lte: date.lte })
      };

      let result = {
        general: {
          workouts: 0,
          exercises: 0,
          sets: 0,
          reps: 0
        },
        exercises: [],
        routines: []
      }

      // console.log(query.startDate);

      const totalWorkoutsInfo = await Workout.aggregate([
        {
          $match: {
            $and: [
              query,
              { exercises: { $exists: true, $ne: [] } }
            ]
          }
        },
        {
          $unwind: "$exercises"
        },
        {
          $unwind: { path: "$exercises.superset", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$_id", // Group by the unique workout instance ID
            exercises: {
              $sum: {
                $add: [
                  1,
                  { $cond: [{ $isArray: "$exercises.superset" }, { $size: "$exercises.superset" }, 0] }
                ]
              }
            },
            sets: {
              $sum: {
                $add: [
                  { $size: { $ifNull: ["$exercises.superset.records", []] } },
                  { $size: { $ifNull: ["$exercises.records", []] } }
                ]
              }
            },
            reps: {
              $sum: {
                $add: [
                  { $sum: { $ifNull: ["$exercises.superset.records.record", 0] } },
                  { $sum: { $ifNull: ["$exercises.records.record", 0] } }
                ]
              }
            },
          }
        },
        {
          $group: {
            _id: null,
            workouts: { $sum: 1 }, // Accumulate the total count of workout instances
            exercises: { $sum: "$exercises" },
            sets: { $sum: "$sets" },
            reps: { $sum: "$reps" }
          }
        }
      ]);

      if (totalWorkoutsInfo[0]) {
        result.general.exercises = totalWorkoutsInfo[0].exercises;
        result.general.sets = totalWorkoutsInfo[0].sets;
        result.general.reps = totalWorkoutsInfo[0].reps;
        result.general.workouts = totalWorkoutsInfo[0].workouts;

        // console.log(totalWorkoutsInfo[0]);
      }

      result.routines = await Workout.aggregate([
        {
          $match: {
            $and: [query]
          }
        },
        {
          $group: {
            _id: '$routineId',
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: null,
            totalWorkouts: { $sum: '$count' },
            routines: { $push: { routineId: '$_id', count: '$count' } }
          }
        },
        {
          $unwind: { path: '$routines', preserveNullAndEmptyArrays: true }
        },
        {
          $project: {
            _id: 0,
            routineId: { $ifNull: ['$routines.routineId', 'other'] },
            count: '$routines.count'
          }
        },
        {
          $group: {
            _id: '$routineId',
            total: { $sum: '$count' }
          }
        },
        {
          $project: {
            _id: 0,
            routineId: '$_id',
            count: '$total'
          }
        },
        {
          $group: {
            _id: null,
            totalWorkouts: { $sum: '$count' },
            routines: { $push: { routineId: '$routineId', count: '$count' } }
          }
        },
        {
          $unwind: { path: '$routines', preserveNullAndEmptyArrays: true }
        },
        {
          $project: {
            _id: 0,
            routineId: '$routines.routineId',
            count: '$routines.count',
            percentage: {
              $multiply: [
                { $divide: ['$routines.count', '$totalWorkouts'] },
                100
              ]
            }
          }
        },
        {
          $lookup: {
            from: 'routines',
            localField: 'routineId',
            foreignField: '_id',
            as: 'routine'
          }
        },
        {
          $unwind: { path: '$routine', preserveNullAndEmptyArrays: true }
        },
        {
          $project: {
            name: { $ifNull: ['$routine.name', 'Other'] },
            val: { $round: ['$percentage', 2] },
            color: {
              $ifNull: ['$routine.color', '#95A5A6']
            }
          }
        },
        {
          $sort: {
            val: -1
          }
        }
      ]);

      result.exercises = await Workout.aggregate([
        {
          $match: query
        },
        {
          $project: {
            _id: 0,
            totalExercises: "$exercises"
          }
        },
        { $unwind: "$totalExercises" },
        { $unwind: { path: "$totalExercises.superset", preserveNullAndEmptyArrays: true } },
        // {
        //   $project: {
        //     exId: { $cond: { if: { $gt: [{ $type: "$totalExercises.superset" }, "missing"] }, then: "$totalExercises.superset.exId", else: "$totalExercises.exId" } },
        //   }
        // },
        {
          $project: {
            exId: {
              $cond: {
                if: { $gt: [{ $type: "$totalExercises.superset" }, "missing"] },
                then: "$totalExercises.superset.exId",
                else: "$totalExercises.exId"
              }
            },
            hasRecords: {
              $cond: [
                {
                  $or: [
                    { $gt: [{ $size: { $ifNull: ["$totalExercises.superset.records", []] } }, 0] },
                    { $gt: [{ $size: { $ifNull: ["$totalExercises.records", []] } }, 0] }
                  ]
                },
                true,
                false
              ]
            }
          }
        },
        {
          $match: {
            hasRecords: true
          }
        },
        {
          $group: {
            _id: "$exId._id",
            name: { $first: "$exId.name" },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: null,
            totalExercisesCount: { $sum: "$count" },
            totalExercises: { $push: { name: "$name", count: "$count" } }
          }
        },
        { $unwind: "$totalExercises" },
        {
          $project: {
            _id: 0,
            name: "$totalExercises.name",
            val: { $round: [{ $multiply: [{ $divide: ["$totalExercises.count", "$totalExercisesCount"] }, 100] }, 2] },
          }
        },
        {
          $sort: {
            val: -1
          }
        }
      ]);

      console.log('\n\n----------------------------\n\n', result.exercises)

      return result;
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  },
}