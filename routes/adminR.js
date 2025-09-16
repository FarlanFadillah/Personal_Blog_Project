const router = require('express').Router();
const dashboardController = require('../controllers/adminC');


router.use(dashboardController.authentication);
router.get('/', dashboardController.renderDashboardPage);


module.exports = router;