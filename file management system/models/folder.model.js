const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Folder', folderSchema);
