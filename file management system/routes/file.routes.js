const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');

const {
  upload,
  uploadFile,
  listFiles,
  downloadFileById,
  downloadFileByName
} = require('../controllers/file.controller');

// Upload file
router.post('/upload', authenticate, upload.single('file'), uploadFile);


// List all files
router.get('/list',authenticate, listFiles);

// Download by ID
router.get('/id/:id',authenticate, downloadFileById);

// Download by name
router.get('/name/:name',authenticate, downloadFileByName);

module.exports = router;
