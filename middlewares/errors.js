function loginErrorHandler(error, req, res, next) {
    if(req.originalUrl !== '/auth/login') next(error);
    req.session.destroy();
    res.render('pages/login', {msg : error.message});
}

module.exports = {
    loginErrorHandler
};