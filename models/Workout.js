const mongoose = require('mongoose');
const Exercise = require('./Exercise');
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
    trim: true,
    minLength: [3, 'Too short'],
    maxLength: [35, 'Max length is 35'],
  },
  color: {
    type: String,
    required: [true, 'Color required'],
  },
  startDate: {
    type: String,
    default: new Date().toISOString()
  },
  endDate: {
    type: String
  },
  exercises: [{
    exId: {
      _id: {
        type: Schema.Types.ObjectId,
        default: undefined,
      },
      name: {
        type: String,
        default: undefined,
      },
      type: {
        type: Number,
        default: undefined,
      }
    },
    records: {
      type: [{
        record: {
          type: Number,
          required: true
        },
        weight: {
          type: Number,
          required: true,
          default: 0
        }
      }],
      default: undefined,
      _id: false
    },
    superset: {
      type: [{
        // exId:{type:Schema.Types.Mixed},
        exId: {
          _id: {
            type: Schema.Types.ObjectId,
          },
          name: {
            type: String,
          },
          type: {
            type: Number,
          }
        },
        records: {
          type: [{
            record: {
              type: Number,
              required: true
            },
            weight: {
              type: Number,
              required: true,
              default: 0
            }
          }],
          default: undefined
        }
      }],
      default: undefined,
    }
  }],
  routineId: {
    type: Schema.Types.ObjectId,
    ref: 'Routine'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

  // Pre-save hook to remove null values from exId and records in each exercise
  workoutSchema.pre('save', function (next) {
    this.exercises.forEach(exercise => {
      if (exercise.exId === null || exercise?.exId?._id === null) {
        exercise.exId = undefined;
      }
      if (exercise.records === null) {
        exercise.records = undefined;
      }
      if (exercise.superset === null) {
        exercise.superset = undefined;
      }
    });
    next();
  });


module.exports = mongoose.model('Workout', workoutSchema)