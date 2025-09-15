const router = require('express').Router();
const dashboardController = require('../controllers/adminC');

router.get('/dashboard', dashboardController.renderDashboardPage);
router.route('/article/new').get(dashboardController.renderNewArticlePage).post(dashboardController.newArticle);
router.route('/article/edit/:id').get(dashboardController.renderEditArticlePage).post(dashboardController.editArticle);
router.route('/article/delete/:id').post(dashboardController.deleteArticle);

module.exports = router;