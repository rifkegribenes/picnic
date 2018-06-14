const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ParkSchema = new Schema({
  guestList: [String],
  parkId: String // yelp park id, separate from auto-assigned mongo _id
},{
  timestamps: true
});


ParkSchema.pre('save', function(next) {

  next();
});

module.exports = mongoose.model('Park', ParkSchema);