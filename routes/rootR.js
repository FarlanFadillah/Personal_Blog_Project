const {renderHomePage, renderArticlePage} = require("../controllers/homeC");
const router = require('express').Router();

router.get('/', (req, res)=>{
    res.redirect('/home');
})
router.get('/home', renderHomePage);
router.get('/article/:id', renderArticlePage);


module.exports = router;