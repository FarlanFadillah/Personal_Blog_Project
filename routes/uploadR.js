const upload = require("../middlewares/image_uploader");
const router = require('express').Router();
const {uploadImage, deleteImage} = require('../controllers/uploadC');
const {authentication, adminAuthentication} = require("../middlewares/authentication");
const {uploadErrorHandler} = require('../middlewares/errorsHandler')

router.use(authentication);
router.post('/image', upload.single('image'), uploadImage);

router.post('/delete', deleteImage);

router.use(uploadErrorHandler);

module.exports = router;