const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const memorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String
});

memorySchema.set('timestamps', true);

const Memory = mongoose.model("Memory", memorySchema);

module.exports = Memory;