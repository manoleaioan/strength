const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
    trim: true,
    minLength: [3, 'Too short'],
    maxLength: [35, 'Max length is 35'],
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
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }
});


exerciseSchema.index({ name: 1, user: 1 }, { unique: true, partialFilterExpression: { name: { $exists: true }, user: { $exists: true } } });

module.exports = mongoose.model('Exercise', exerciseSchema)