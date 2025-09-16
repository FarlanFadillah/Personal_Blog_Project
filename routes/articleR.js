const router = require('express').Router();
const { authentication } = require('../controllers/adminC');
const articleController = require('../controllers/articleC')

router.use(authentication);
router.route('/new').get(articleController.renderNewArticlePage).post(articleController.newArticle);
router.route('/edit/:id').get(articleController.renderEditArticlePage).post(articleController.editArticle);
router.route('/delete/:id').post(articleController.deleteArticle);

module.exports = router;