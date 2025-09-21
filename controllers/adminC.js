const articleModel = require("../models/articlesM");
const asyncHandler = require("../utils/asyncHandler");

const renderDashboardPage = asyncHandler( async(req, res, next)=> {
    res.locals.articles = await articleModel.getArticleByAuthorName(req.session.user.username);
    res.locals.user = req.session.user;
    res.status(200).render('pages/dashboard');
});


module.exports = {
    renderDashboardPage,
};