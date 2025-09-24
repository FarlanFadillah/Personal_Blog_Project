const asyncHandler = require("../utils/asyncHandler");
const imageM = require('../models/imageM');
const {CustomError} = require("../utils/errors");

const uploadImage = asyncHandler(async (req, res, next) => {
    if (!req.file) return next(new CustomError('No file uploaded', 'error'));
    console.log(req.file);
    // get the image path
    const filePath = `/uploads/${req.file.filename}`;
    const username = req.session.user.username;

    await imageM.addImage(filePath, username);
    const backURL = req.header('Referer') || '/';

    res.redirect(backURL);
});

const getAllImages = asyncHandler(async (req, res, next) => {
    res.locals.images = await imageM.getAllImagesByUsername(req.session.user.username);
    next();
});

const deleteImage = asyncHandler(async (req, res, next) => {
    const {id} = req.query;

    if(id === undefined || id === null) {
        return next(new CustomError('No id', 'error'));
    }

    const image = await imageM.getImageById(id);
    if(!image) return next(new CustomError('Image not found', 'error'));

    await imageM.deleteImageDBS(id);
    await imageM.deleteImageFile(image.filePath);

    // 'Referer' get the previous url
    res.redirect(req.header('Referer') || '/');
})

module.exports = {
    uploadImage,
    getAllImages,
    deleteImage,
}