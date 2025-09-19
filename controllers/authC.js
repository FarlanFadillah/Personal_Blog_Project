const authM = require('../models/authM');
const hasher = require('../utils/hashing');
const asyncHandler = require('../utils/asyncHandler');
const {addMessage} = require("../utils/flashMessage");
const {matchedData} = require('express-validator')
function renderLoginForm(req, res){
    // check if user is authenticated by accessing the session property 'isAuthenticated'
    if(req.session.isAuthenticated) return res.redirect('/home')
    res.status(200).render('pages/login');
}

function renderAccountSettingPage (req, res, next) {
    res.status(200).render('pages/settings', {user: req.session.user});
}

const login = asyncHandler(async (req, res, next) => {
    const {username, password} = req.body;

    //getting the user by username/email
    // by checking the username string is contained '@' or no
    let user = [];
    if(username.includes('@')) user = await authM.getUserByEmail(username);
    else user = await authM.getUser(username);

    // check if user is existing
    if(user === undefined) throw new Error(`User not found!`);

    // Take the password from input, encrypt it, and check if it matches the one saved for the user.
    await hasher.passValidate(password, user.hash);

    //if username and password is match, then create the session and store some user data
    req.session.user = {
        username : user.username,
        isAdmin : user.isAdmin,
        email : user.email,
        first_name : user.first_name,
        last_name : user.last_name
    }
    req.session.isAuthenticated = true;
    res.status(200).redirect('/admin');
});

function logout(req, res) {
    // destroy the session, and redirect the route to login
    req.session.destroy();
    res.redirect('/auth/login');
}

const updateUser = asyncHandler(async (req, res) => {
    const {username, first_name, last_name, email} = matchedData(req);

    await authM.updateUser(req.session.user.username, username, first_name, last_name, email);
    req.session.user = {
        username : username,
        isAdmin : req.session.user.isAdmin,
        email : email,
        first_name : first_name,
        last_name : last_name
    }
    req.session.isAuthenticated = true;
    res.status(200).redirect('/admin');
})



// Register system (not used)
// async function checkUser(req, res, next) {
//     const {username} = req.body;
//     try {
//         const data = await authM.getUser(username);
//         if(data === undefined) return next();
//         res.status(200).render('pages/register', {msg : "username already exists"});
//     } catch (error) {
//         next(error);
//     }
// }
//
function renderRegisterForm(req, res) {
    res.render('pages/register', {messages : res.locals.messages});
}


const register = asyncHandler( async (req, res, next) => {
    const {username, first_name, last_name, email} = matchedData(req);
    const {password} = req.body;
    const hash = await hasher.genHashBcrypt(password);
    await authM.addUser(username, first_name, last_name, email, hash);
    res.status(200).redirect('/admin');
});

const renderUserListPage = asyncHandler(async (req, res) => {
    res.locals.users = await authM.getAllUsers();
    res.status(200).render('pages/user_lists');
})

const deleteUserByUsername = asyncHandler(async (req, res) => {
    const {username} = req.params;
    await authM.deleteUser(username);
    addMessage(req, 'success', 'User deleted successfully.');
    res.status(200).redirect('/auth/users');
});


const updateUserPassword = asyncHandler(async (req, res) => {
    const {username} = req.session.user;
    const {old_password, password} = req.body;

    const user = await authM.getUser(username);

    await hasher.passValidate(old_password, user.hash);

    await authM.updateOneColumn(username, 'hash', await hasher.genHashBcrypt(password));
    addMessage(req, 'success', 'Password updated successfully.');
    res.status(200).redirect('/admin');
})



module.exports = {
    login,
    logout,
    renderLoginForm,
    renderAccountSettingPage,
    updateUser,
    updateUserPassword,
    renderRegisterForm,
    register,
    renderUserListPage,
    deleteUserByUsername,
}
