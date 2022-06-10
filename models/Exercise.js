const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
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
  type: {
    type: Number,
    default: 0
  },
  maxRep: {
    type: Number,
    default: 0
  },
  maxVol: {
    type: Number,
    default: 0
  },
  activityAt: {
    type: String,
    default: new Date().toISOString()
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})


module.exports = mongoose.model('Exercise', exerciseSchema)