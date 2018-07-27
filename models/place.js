const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const placeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  memoryId: { type: Schema.Types.ObjectId, ref: 'Memory' },
  name: { type: String, default: 'Anonymous' },
  description: { type: String, default: 'Memories' },
  location: { type: { type: String }, coordinates: [Number] },
  imgPath: { type: String, default: '/images/Made-for-Memories.jpg' },
  imgName: { type: String, default: 'Made-for-Memories.jpg' }
});

placeSchema.index({ location: '2dsphere' });

placeSchema.set('timestamps', true);

placeSchema.plugin(require('mongoose-get-default-value'));

const Place = mongoose.model("Place", placeSchema);

Place.getDefaultValue('default');

module.exports = Place;