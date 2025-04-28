mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    size: Number,
    mimeType: String,
    downloadCount: {
      type: Number,
      default: 0
    },    
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    accessLevel: {
      type: String,
      enum: ['only_me', 'public', 'timed'],
      default: 'only_me',
    },
    expiresAt: {
      type: Date,
      default: null
    },
    accessToken: {
      type: String,
      unique: true,
      sparse: true
    },
    downloadCount: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", fileSchema);