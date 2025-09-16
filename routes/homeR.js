const {renderHomePage, renderArticlePage} = require("../controllers/homeC");
const router = require('express').Router();

router.get('/', renderHomePage);
router.get('/article/:id', renderArticlePage);


module.exports = router;