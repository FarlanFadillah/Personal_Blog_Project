const {renderHomePage} = require("../controllers/homeC");
const router = require('express').Router();

router.get('/', renderHomePage);

module.exports = router;