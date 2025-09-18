function authentication(req, res, next){
    console.log('[AUTH MIDDLEWARE]', req.method, req.originalUrl);
    if(!req.session.isAuthenticated) {
        console.log('[AUTH FAILED] redirecting...');
        return res.redirect('/auth/login');
    }
    console.log('[AUTH PASSED]');
    next();
}


module.exports = {authentication};