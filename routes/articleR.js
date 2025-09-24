const router = require('express').Router();
const { authentication } = require('../middlewares/authentication');
const { newArticle,
        renderFormArticlePage,
        editArticle,
        deleteArticle} = require('../controllers/articleC');


const {getAllImages} = require('../controllers/uploadC');

const {idValidator, titleValidator, contentValidator} = require('../validators/articleV');

const {articleErrorHandler} = require('../middlewares/errorsHandler');

const upload = require('../middlewares/image_uploader');

const {validatorErrorHandler} = require('../middlewares/validatorErr');

router.use(authentication);

router.route('/form')
    .get(getAllImages, renderFormArticlePage);

router.route('/save')
    .post(...titleValidator, ...contentValidator, validatorErrorHandler, editArticle, newArticle);

router.route('/delete/:id')
    .post(deleteArticle);

// errors handler
router.use(articleErrorHandler);



module.exports = router;