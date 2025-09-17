const articleModel = require("../models/articlesM");
const asyncHandler = require("../utils/asyncHandler");



const renderDashboardPage = asyncHandler( async(req, res, next)=> {
    req.session.errors = null;
    res.locals.articles = await articleModel.getAllArticles();
    res.status(200).render('pages/dashboard');
});





module.exports = {
    renderDashboardPage,
};