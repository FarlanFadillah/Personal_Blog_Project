const router = require("express").Router();
const {renderLoginForm,
    login,
    logout,
    renderAccountSettingPage,
    updateUser, renderRegisterForm, register, renderUserListPage, deleteUserByUsername
} = require("../controllers/authC");

const {loginValidator,
    accountProfileValidator,
    passwordValidator, usernameValidator
} = require('../validators/authV');

const {validatorErrorHandler} = require('../middlewares/validatorErr');
const {authentication, adminAuthentication} = require('../middlewares/authentication');
const {addMessage} = require('../utils/flashMessage')


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

router.route('/register')
    .get(adminAuthentication, renderRegisterForm)
    .post(...accountProfileValidator, ...passwordValidator, validatorErrorHandler, register);

router.route('/users')
    .get(adminAuthentication, renderUserListPage);

router.route('/users/delete/:username')
    .post(adminAuthentication, deleteUserByUsername);

// ERROR HANDLER SECTION

router.use((error, req, res, next) => {
    if(req.originalUrl === '/auth/login') {
        addMessage(req, 'error', error.message)
        return res.redirect('/auth/login');
    }
    else if(req.originalUrl === '/auth/register'){
        addMessage(req, 'error', error.message);
        return res.redirect('/auth/register');
    }
    next(error);
});


router.use((error, req, res, next) =>{
    if(req.originalUrl === '/auth/settings') {
        return res.redirect('/auth/settings');
    }
    next(error);
})


    // .post(authController.checkUser, authController.register);



module.exports = router;