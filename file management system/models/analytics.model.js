const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalFilesUploaded: { type: Number, default: 0 },
  totalStorageUsed: { type: Number, default: 0 },
  totalDownloads: { type: Number, default: 0 },
  totalApiHits: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
