const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routineSchema = new Schema({
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
  exercises: [{
    exId: {
      type: Schema.Types.ObjectId,
      ref: 'Exercise'
    },
    superset: {
      type: [{
        exId: {
          type: Schema.Types.ObjectId,
          ref: 'Exercise'
        }
      }],
      default: undefined,
    }
  }],
  lastWorkoutDate: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

routineSchema.index({ name: 1, user: 1 }, { unique: true, partialFilterExpression: { name: { $exists: true }, user: { $exists: true } } });

module.exports = mongoose.model('Routine', routineSchema)