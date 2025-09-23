const router = require('express').Router();
const { authentication } = require('../middlewares/authentication');
const {renderNewArticlePage,
        newArticle,
        renderEditArticlePage,
        editArticle,
        deleteArticle} = require('../controllers/articleC');

const {idValidator} = require('../validators/articleV');

const {articleErrorHandler} = require('../middlewares/errorsHandler');

const upload = require('../middlewares/image_uploader');

router.use(authentication);

router.route('/new')
    .get(renderNewArticlePage)
    .post(newArticle);

router.post('/upload/image', upload.single('image'), (req, res) => {
    console.log('uploading image')
    res.redirect('/admin')
});

router.route('/edit/:id')
    .get(...idValidator, renderEditArticlePage)
    .post(editArticle);

router.route('/delete/:id')
    .post(deleteArticle);

// errors handler
router.use(articleErrorHandler);



module.exports = router;