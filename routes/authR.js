const router = require("express").Router();
const {renderLoginForm,
    login,
    logout,
    renderAccountSettingPage,
    updateUser, renderRegisterForm,
    register,
    renderUserListPage,
    deleteUserByUsername,
    updateUserPassword
} = require("../controllers/authC");

const {loginValidator,
    accountProfileValidator,
    passwordValidator
} = require('../validators/authV');

const {validatorErrorHandler} = require('../middlewares/validatorErr');
const {authentication, adminAuthentication} = require('../middlewares/authentication');
const {addMessage} = require('../utils/flashMessage');

// logger module
const logger = require('../utils/logger');
const loggerAuth = logger.child({module : 'authentication router'})


// prevent user to access the root route
router.get('/', (req, res) => {
    res.redirect('/auth/login');
})

router.route('/login')
    .get(renderLoginForm)
    .post(...loginValidator, validatorErrorHandler, login);

router.route('/logout')
    .post(logout);

router.route('/settings')
    .get(authentication, renderAccountSettingPage)
    .post(...accountProfileValidator, validatorErrorHandler, updateUser);

router.route('/settings/change-password')
    .post(authentication, ...passwordValidator, validatorErrorHandler, updateUserPassword);

router.route('/register')
    .get(adminAuthentication, renderRegisterForm)
    .post(...accountProfileValidator, ...passwordValidator, validatorErrorHandler, register);

router.route('/users')
    .get(adminAuthentication, renderUserListPage);

router.route('/users/delete/:username')
    .post(adminAuthentication, deleteUserByUsername);


router.route('/settings/delete-account')
    .post(adminAuthentication, (req, res, next)=>{
        next(new Error('Unable to delete account right now.'));
    })

// ERROR HANDLER SECTION
router.use((error, req, res, next) => {
    addMessage(req, 'error', error.message);
    loggerAuth.error(error.message);
    if(req.originalUrl === '/auth/login') return res.redirect('/auth/login');
    else if(req.originalUrl === '/auth/register') return res.redirect('/auth/register');
    else if(req.originalUrl.includes('/auth/users/delete/')) return res.redirect('/auth/users');
    else if(req.originalUrl.includes('/auth/settings/')) return res.redirect('/auth/settings');
    else if(req.originalUrl.includes('delete-account')) return res.redirect('/auth/settings');
    next(error);
});


router.use((error, req, res, next) =>{
    loggerAuth.error(error.message);
    if(req.originalUrl === '/auth/settings') {
        return res.redirect('/auth/settings');
    }
    next(error);
})


    // .post(authController.checkUser, authController.register);



module.exports = router;