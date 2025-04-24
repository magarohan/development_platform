const multer = require('multer');
const File = require('../models/file.model');
const path = require('path');

// Folder to store uploads
const uploadFolder = 'uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const uploadFile = async (req, res) => {
  const file = req.file;
  const folder = req.body?.folder || null;

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: 'Unauthorized. Missing user info.' });
  }

  try {
    const newFile = await File.create({
      filename: file.filename,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      folder: folder || null,
      owner: req.user.userId,
    });

    res.status(201).json(newFile);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

const listFiles = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const files = await File.find({ owner: req.user.userId });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error listing files', error });
  }
};

const downloadFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const isOwner = file.owner?.toString() === req.user.userId;

    if (!isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.download(path.resolve(file.path), file.filename);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading file', error });
  }
};

const downloadFileByName = async (req, res) => {
  try {
    const file = await File.findOne({ filename: req.params.name });

    if (!file) {
      return res.status(404).send('File not found');
    }

    const isOwner = file.owner?.toString() === req.user.userId;

    if (!isOwner) {
      return res.status(403).send('Access denied');
    }

    res.download(path.resolve(file.path), file.filename);
  } catch (error) {
    console.error('Download by name error:', error);
    res.status(500).send('Error downloading file');
  }
};

module.exports = {
  upload,
  uploadFile,
  listFiles,
  downloadFileById,
  downloadFileByName
};
