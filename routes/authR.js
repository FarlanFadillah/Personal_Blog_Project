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
const {authErrorHandler} = require('../middlewares/errorsHandler');


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

router.route('/change-password')
    .post(authentication, ...passwordValidator, validatorErrorHandler, updateUserPassword);

router.route('/register')
    .get(adminAuthentication, renderRegisterForm)
    .post(...accountProfileValidator, ...passwordValidator, validatorErrorHandler, register);

router.route('/users')
    .get(adminAuthentication, renderUserListPage);

router.route('/delete/:username')
    .post(adminAuthentication, deleteUserByUsername);

// errors handler
router.use(authErrorHandler);

module.exports = router;