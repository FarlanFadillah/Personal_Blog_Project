const {renderHomePage, renderArticlePage} = require("../controllers/rootC");
const router = require('express').Router();
const {idValidator} = require('../validators/articleV');
const {validatorErrorHandler} = require('../middlewares/validatorErr');


router.get('/', (req, res)=>{
    res.redirect('/home');
})
router.get('/home', renderHomePage);
router.get('/article/:id', idValidator, validatorErrorHandler, renderArticlePage);


router.use((err, req, res, next)=>{
    return res.redirect('/home');
})


module.exports = router;