const articleModel = require("../models/articlesM");
const asyncHandler = require("../utils/asyncHandler");

function authentication(req, res, next){
    if(!req.session.isAuthenticated) return res.redirect('/auth/login');
    next();
}

const renderDashboardPage = asyncHandler( async(req, res, next)=> {
    res.locals.articles = await articleModel.getAllArticles();
    res.status(200).render('pages/dashboard');
});





module.exports = {
    renderDashboardPage,
    authentication
};