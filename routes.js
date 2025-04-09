const express = require('express');
const multer = require('multer');
const File = require('./fileModel.js');
const path = require('path');
const fs = require('fs');

const router = express.Router();
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

// Upload file
router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const savedFiles = await Promise.all(
      req.files.map(file => {
        const { filename, path: filePath, size } = file;
        const newFile = new File({
          filename,
          path: filePath,
          size
        });
        return newFile.save();
      })
    );

    res.status(201).json(savedFiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File upload failed', details: err.message });
  }
});



// List all files
router.get('/files', async (req, res) => {
  const files = await File.find();
  res.json(files);
});

// Download by ID
router.get('/files/id/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');
    res.download(path.resolve(file.path), file.filename);
  } catch {
    res.status(500).send('Error downloading file');
  }
});

// Download by name
router.get('/files/name/:name', async (req, res) => {
  try {
    const file = await File.findOne({ filename: req.params.name });
    if (!file) return res.status(404).send('File not found');
    res.download(path.resolve(file.path), file.filename);
  } catch {
    res.status(500).send('Error downloading file');
  }
});

module.exports = router;
