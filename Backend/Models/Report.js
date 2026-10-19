const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  problemStatement: String,
  coordinates: {
    type: [Number], // Expecting [lat, lng, lat, lng...] or a simplified box
    required: true
  },
  soilData: Object, // Stores the raw data from USDA
  calculatedResults: Object, // Stores your "Excel" calculation results
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);
