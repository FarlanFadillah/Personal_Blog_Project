const router = require('express').Router();
const {renderDashboardPage} = require('../controllers/adminC');
const {authentication} = require('../middlewares/authentication');

router.use(authentication);
router.get('/', renderDashboardPage);


module.exports = router;