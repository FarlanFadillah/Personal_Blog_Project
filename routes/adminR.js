const router = require('express').Router();
const {renderDashboardPage} = require('../controllers/adminC');
const {authentication} = require('../middlewares/authentication');
const {adminErrorHandler} = require('../middlewares/errorsHandler');
const {getAllImages} = require('../controllers/uploadC');

router.use(authentication);
router.get('/', getAllImages, renderDashboardPage);

// errors handler
router.use(adminErrorHandler);

module.exports = router;