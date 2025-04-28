const Folder = require('../models/folder.model');
const File = require('../models/file.model');

const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;

    const newFolder = new Folder({
      folderName,
      owner: req.user.userId
    });

    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (error) {
    console.error('Create Folder Error:', error);
    res.status(500).json({ message: 'Error creating folder', error });
  }
};

const renameFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user.userId });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    folder.folderName = folderName;
    await folder.save();
    res.json(folder);
  } catch (error) {
    console.error('Rename Folder Error:', error);
    res.status(500).json({ message: 'Error renaming folder', error });
  }
};

const deleteFolder = async (req, res) => {
    try {
      const folder = await Folder.findOne({ _id: req.params.id, owner: req.user.userId });
  
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }
  
      await File.deleteMany({ folder: folder._id });
      await Folder.findByIdAndDelete(folder._id);
  
      res.json({ message: 'Folder deleted successfully' });
    } catch (error) {
      console.error('Delete Folder Error:', error);
      res.status(500).json({ message: 'Error deleting folder', error });
    }
  };
  

const listFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user.userId });
    res.json(folders);
  } catch (error) {
    console.error('List Folders Error:', error);
    res.status(500).json({ message: 'Error listing folders', error });
  }
};

const getFilesInFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const files = await File.find({ folder: folderId, owner: req.user.userId });
    res.json(files);
  } catch (error) {
    console.error('Get Files in Folder Error:', error);
    res.status(500).json({ message: 'Error getting files in folder', error });
  }
};

module.exports = {
  createFolder,
  renameFolder,
  deleteFolder,
  listFolders,
  getFilesInFolder
};
