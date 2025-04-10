const express = require('express');
const router = express.Router();

const {
  upload,
  uploadFiles,
  listFiles,
  downloadFileById,
  downloadFileByName
} = require('../controllers/file.controller');

// Upload file
router.post('/upload', upload.array('files'), uploadFiles);

// List all files
router.get('/files', listFiles);

// Download by ID
router.get('/files/id/:id', downloadFileById);

// Download by name
router.get('/files/name/:name', downloadFileByName);

module.exports = router;
