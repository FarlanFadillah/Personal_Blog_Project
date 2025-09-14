const dashboardController = require("./adminC");
const articleModel = require("../models/articlesM");
const randNumber = require("../services/randNumber");

async function renderDashboardPage(req, res, next) {
    if(!req.session.isAuthenticated) return res.redirect('/auth/login');
    try{
        const articles = await articleModel.getAllArticles();
        res.status(200).render('pages/dashboard', {articles : articles});
    }catch(err){
        next(err);
    }
}

function renderNewArticlePage(req, res) {
    if(!req.session.isAuthenticated) return res.redirect('/auth/login');
    res.status(200).render('pages/article', {title : 'New Article', route : '/admin/article/new'});
}

function renderEditArticlePage(req, res) {
    if(!req.session.isAuthenticated) return res.redirect('/auth/login');
    const {id} = req.params;
    if(!id) return res.redirect('/admin/dashboard');
    res.status(200).render('pages/article', {title : 'Edit Article', route : '/admin/article/edit/' + id});
}

async function newArticle(req, res, next) {
    if(!req.session.isAuthenticated) return res.redirect('/auth/login');
    try{
        const {title, content} = req.body;
        const username = req.session.user.username;
        const path = './public/articles/' + title + '_' + username + '_' + randNumber(10000, 99999) + '.json';
        await articleModel.writeArticleToJson(path, title, content);
        await articleModel.createArticle(title, path, username);
        res.redirect('/admin/dashboard');
    }catch(err){
        next(err);
    }
}

module.exports = {
    renderDashboardPage,
    renderNewArticlePage,
    renderEditArticlePage,
    newArticle,
};