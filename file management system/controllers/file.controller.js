const multer = require('multer');
const File = require('../models/file.model');
const Folder = require('../models/folder.model');
const Analytics = require('../models/analytics.model');
const path = require('path');
const fs = require('fs');

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

    const analytics = await Analytics.findOne({ user: req.user.userId });
      if (analytics) {
        analytics.totalFilesUploaded += 1;
        analytics.totalStorageUsed += req.file.size;
        await analytics.save();
      } else {
        const newAnalytics = new Analytics({
          user: req.user.userId,
          totalFilesUploaded: 1,
          totalStorageUsed: req.file.size,
        });
        await newAnalytics.save();
      }

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

    if (file.accessLevel === 'only_me' && !isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (file.accessLevel === 'timed' && Date.now() > file.expiresAt) {
      return res.status(403).json({ message: 'Access expired' });
    }

    res.download(path.resolve(file.path), file.filename);
    file.downloadCount += 1;
    await file.save();

    const analytics = await Analytics.findOne({ user: req.user.userId });
    if (analytics) {
      analytics.totalDownloads += 1;
      await analytics.save();
    }
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
    file.downloadCount += 1;
    await file.save();

    const analytics = await Analytics.findOne({ user: req.user.userId });
    if (analytics) {
      analytics.totalDownloads += 1;
      await analytics.save();
    }

    res.download(path.resolve(file.path), file.filename);
  } catch (error) {
    console.error('Download by name error:', error);
    res.status(500).send('Error downloading file');
  }
};

const updateAccessLevel = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).send('File not found');
    }
    file.accessLevel = req.body.accessLevel;
    await file.save();
    res.send('Access level updated successfully');
  } catch (error) {
    console.error('Error updating access level:', error);
    res.status(500).send('Error updating access level');
  }
}

const generateAccessLink = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.accessLevel === 'public') {  
      res.status(200).json({ link: `http://localhost:4000/files/id/${file._id}` });
    } else if (file.accessLevel === 'timed') {
      res.status(200).json({ link: `http://localhost:4000/files/id/${file._id}` });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Generate access link error:', error);
    res.status(500).json({ message: 'Error generating access link', error });
  }
};

module.exports = {
  uploadFile,
  listFiles,
  downloadFileById,
  downloadFileByName,
  updateAccessLevel,
  generateAccessLink
};
