const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routineSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
    unique: true,
    trim: true,
    minLength: [3, 'Too short'],
    maxLength: [35, 'Max length is 35'],
    index: {
      unique: true,
    }
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})


module.exports = mongoose.model('Routine', routineSchema)