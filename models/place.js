const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const placeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
  location: { type: { type: String }, coordinates: [Number] },
  path: String,
  originalName: String
});

placeSchema.index({ location: '2dsphere' });

placeSchema.set('timestamps', true);

module.exports = mongoose.model('Place', placeSchema);