const router = require('express').Router();
const { authentication } = require('../middlewares/authentication');
const {renderNewArticlePage,
        newArticle,
        renderEditArticlePage,
        editArticle,
        deleteArticle} = require('../controllers/articleC');

const {idValidator} = require('../validators/articleV');

router.use(authentication);

router.route('/new')
    .get(renderNewArticlePage)
    .post(newArticle);

router.route('/edit/:id')
    .get(idValidator, renderEditArticlePage)
    .post(editArticle);

router.route('/delete/:id')
    .post(deleteArticle);

module.exports = router;