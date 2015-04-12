var mongoose = require('mongoose');

var providerSchema = new mongoose.Schema({
  id: { type: Number, min: 1, max: 65 },
  firstName: String,
  lastName: String,
  phoneNumber: String,
  specialist: String,
  procedures: String,
  address1: String,
  address2: String,
  location: String,
  maploc: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
  },
  pic: String,
  owner: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('provider', providerSchema);

