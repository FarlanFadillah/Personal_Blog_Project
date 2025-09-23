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
    res.redirect('/admin');
});

const getAllImages = asyncHandler(async (req, res, next) => {
    res.locals.images = await imageM.getAllImagesByUsername(req.session.user.username);
    next();
});

module.exports = {
    uploadImage,
    getAllImages,
}