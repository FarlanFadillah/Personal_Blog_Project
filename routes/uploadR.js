const upload = require("../middlewares/image_uploader");
const router = require('express').Router();
const {uploadImage} = require('../controllers/uploadC');
const {authentication, adminAuthentication} = require("../middlewares/authentication");

router.use(authentication);
router.post('/image', upload.single('image'), uploadImage);

module.exports = router;