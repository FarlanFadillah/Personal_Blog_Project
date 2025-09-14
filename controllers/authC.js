const authM = require('../models/authM');
const hasher = require('../services/hashing');

function renderLoginForm(req, res){
    // check if user is authenticated by accessing the session property 'isAuthenticated'
    if(req.session.isAuthenticated) return res.redirect('/home')
    res.status(200).render('pages/login', {msg : null});
}
async function login(req, res, next) {
    const {username, password} = req.body;
    try {
        //getting the user by username
        const user = await authM.getUser(username);

        // check if user is existing
        if(user === undefined) throw new Error(`User not found!`);

        // Take the password from input, encrypt it, and check if it matches the one saved for the user.
        await hasher.auth(password, user.salt, user.hash);

        //if username and password is match, then76 create the session and store some user data
        req.session.user = {
            username : user.username,
            isAdmin : user.isAdmin,
        }
        req.session.isAuthenticated = true;
        res.status(200).redirect('/admin/dashboard');
    } catch (error) {
        next(error);
    }
}

async function logout(req, res) {
    // destroy the session, and redirect the route to login
    req.session.destroy();
    res.redirect('/auth/login');
}



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
// function renderRegisterForm(req, res) {
//     if(req.session.isAuthenticated) return res.redirect('/home');
//     res.render('pages/register', {msg : null});
// }
//
// async function register(req, res) {
//     try {
//         const {username, first_name, last_name, email, password} = req.body;
//         const {salt, hash} = await hasher.hash(password);
//         await authM.addUser(username, first_name, last_name, email, salt, hash);
//         //flash message
//         res.session.flash = "Register successfully";
//         res.status(200).redirect('/auth/login');
//     }catch(err){
//         res.status(200).render('pages/register', {msg : err.message});
//     }
//
// }



module.exports = {
    login, logout, renderLoginForm
}
