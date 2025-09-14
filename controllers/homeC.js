
function renderHomePage(req, res, next){
    if(!req.session.isAuthenticated) return res.redirect('/auth/login');
    res.render('pages/home', {msg : null, user : req.session.user});
}

module.exports = {renderHomePage}