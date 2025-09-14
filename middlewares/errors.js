function loginErrorHandler(error, req, res, next) {
    if(req.originalUrl !== '/auth/login') next(error);
    res.render('pages/login', {msg : 'err.message'});
}

module.exports = {
    loginErrorHandler
};