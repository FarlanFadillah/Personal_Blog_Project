const multer = require('multer');
const path = require('path');
const {CustomError} = require("../utils/errors");

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // folder to save uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if(file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new CustomError('File only support image', 'warning'), false);
        }
    }
});

module.exports = upload;