const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ParkSchema = new Schema({
  id: String,
  guests: [String]
},{
  timestamps: true
});


ParkSchema.pre('save', function(next) {

  next();
});

module.exports = mongoose.model('Park', ParkSchema);