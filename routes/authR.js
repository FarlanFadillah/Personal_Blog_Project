const router = require("express").Router();
const authController = require("../controllers/authC");

// prevent user to access the root route
router.get('/', (req, res) => {
    res.redirect('/auth/login');
})

router.route('/login')
    .get(authController.renderLoginForm)
    .post(authController.login);

router.route('/logout').post(authController.logout);
router.route('/settings').get(authController.renderAccountSettingPage).post(authController.updateUser);


// Not used
// router.route('/register')
//     .get(authController.renderRegisterForm)
//     .post(authController.checkUser, authController.register);



module.exports = router;