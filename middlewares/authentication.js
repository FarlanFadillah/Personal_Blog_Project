const {addMessage} = require("../utils/flashMessage");

function authentication(req, res, next){
    console.log('[AUTH MIDDLEWARE]', req.method, req.originalUrl);
    if(!req.session.isAuthenticated) {
        console.log('[AUTH FAILED] redirecting...');
        return res.redirect('/auth/login');
    }
    console.log('[AUTH PASSED]');
    next();
}

function adminAuthentication(req, res, next){
    console.log('[AUTH MIDDLEWARE]', req.method, req.originalUrl);
    if(!req.session.user) {
        console.log('[AUTH FAILED] redirecting...');
        addMessage(req, 'bad request', 'unauthenticated');
        return res.redirect('/auth/login');
    }
    else if(!req.session.user.isAdmin) {
        console.log('[AUTH FAILED] unauthorized...');
        addMessage(req, 'bad request', 'unauthorized');
        return res.redirect('/admin');
    }
    console.log('[AUTH PASSED]');
    next();
}
module.exports = {authentication, adminAuthentication};