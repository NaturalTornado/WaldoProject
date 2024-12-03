const express = require('express');
const {
    renderPhotoManagementPage,
    addPhoto,
    addTag,
    fetchPhotosWithTags,
} = require('../controllers/adminController');

const router = express.Router();

// Render photo management page
router.get('/photos', renderPhotoManagementPage);

// Add a new photo
router.post('/photos/add', addPhoto);

// Add a new tag to a photo
router.post('/photos/:photoId/tags/add', addTag);

// Fetch all photos with their tags
router.get('/photos/tags', fetchPhotosWithTags);

module.exports = router;
