const express = require('express');
const router = express.Router();
const {createFolder,
    renameFolder,
    deleteFolder,
    listFolders,
    getFilesInFolder} = require('../controllers/folder.controller');
const authenticate = require('../middlewares/auth');

router.post('/create',authenticate, createFolder);
router.patch('/rename/:id',authenticate, renameFolder);
router.delete('/delete/:id',authenticate, deleteFolder);
router.get('/list', authenticate, listFolders);
router.get('/:id/files',authenticate, getFilesInFolder);

module.exports = router;