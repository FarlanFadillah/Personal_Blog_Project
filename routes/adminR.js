const router = require('express').Router();
const {renderDashboardPage} = require('../controllers/adminC');
const {authentication} = require('../middlewares/authentication');
const {adminErrorHandler} = require('../middlewares/errorsHandler');

router.use(authentication);
router.get('/', renderDashboardPage);

// errors handler
router.use(adminErrorHandler);

module.exports = router;