const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },    // added location
  experience: { type: String, required: true },  // added experience
  description: { type: String, required: true },
  category: { type: String, required: true },    // fresher / part-time / internship
  lastDate: { type: Date, required: true },       // application deadline
  postedAt: { type: Date, default: Date.now }     // auto-set post time
});

module.exports = mongoose.model('Job', jobSchema);

