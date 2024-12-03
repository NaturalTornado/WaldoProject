//const prisma = require('../prisma/prismaClient');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Render the photo management page.
 */
const renderPhotoManagementPage = async (req, res) => {
    try {
        const photos = await prisma.photos.findMany();
        res.render('photoManagement', { photos });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).send('Server error');
    }
};

/**
 * Add a new photo to the database.
 */
const addPhoto = async (req, res) => {
    const { title, filePath } = req.body;

    try {
        await prisma.photos.create({
            data: { title, file_path: /images/sunny_1.png },
        });
        res.redirect('/admin/photos');
    } catch (error) {
        console.error('Error adding photo:', error);
        res.status(500).send('Server error');
    }
};

/**
 * Add a new tag to a photo.
 */
const addTag = async (req, res) => {
    const { photoId } = req.params;
    const { name, xPercent, yPercent } = req.body;

    try {
        await prisma.tags.create({
            data: {
                photo_id: Number(photoId),
                name,
                x_percent: parseFloat(xPercent),
                y_percent: parseFloat(yPercent),
            },
        });
        res.redirect(`/admin/photos/${photoId}`);
    } catch (error) {
        console.error('Error adding tag:', error);
        res.status(500).send('Server error');
    }
};

/**
 * Fetch all photos with their tags.
 */
const fetchPhotosWithTags = async (req, res) => {
    try {
        const photos = await prisma.photos.findMany({
            include: {
                tags: true,
            },
        });
        res.json(photos);
    } catch (error) {
        console.error('Error fetching photos with tags:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    renderPhotoManagementPage,
    addPhoto,
    addTag,
    fetchPhotosWithTags,
};
