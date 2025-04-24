mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now },
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
      // accessLevel: {
      //   type: String,
      //   enum: ['only_me', 'public', 'timed'],
      //   default: 'only_me',
      // },
});

module.exports = mongoose.model("File", fileSchema);