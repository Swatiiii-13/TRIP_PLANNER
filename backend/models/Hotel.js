const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  basePrice: { type: Number, required: true },
  demandFactor: { type: Number, default: 1.0 },
  seasonMultiplier: { type: Number, default: 1.0 },
  availableRooms: { type: Number, required: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

hotelSchema.virtual('currentPrice').get(function() {
  return this.basePrice * this.demandFactor * this.seasonMultiplier;
});

module.exports = mongoose.model('Hotel', hotelSchema);
