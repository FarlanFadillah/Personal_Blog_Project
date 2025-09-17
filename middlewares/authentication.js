function authentication(req, res, next){
    if(!req.session.isAuthenticated) return res.redirect('/auth/login');
    next();
}

module.exports = {authentication};