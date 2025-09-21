const {renderHomePage, renderArticlePage} = require("../controllers/rootC");
const router = require('express').Router();
const {idValidator} = require('../validators/articleV');
const {validatorErrorHandler} = require('../middlewares/validatorErr');
const {rootErrorHandler} = require('../middlewares/errorsHandler');


router.get('/', (req, res)=>{
    res.redirect('/home');
})
router.get('/home', renderHomePage);
router.get('/view/article/:id', ...idValidator, validatorErrorHandler, renderArticlePage);

// errors handler
router.use(rootErrorHandler);



module.exports = router;