const dashboardController = require("./adminC");
const articleModel = require("../models/articlesM");
const randNumber = require("../services/randNumber");
const {editArticleJson} = require("../models/articlesM");

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
    res.status(200).render('pages/article', {
            title : 'New Article',
            route : '/admin/article/new',
            article_title : null,
            content : null});
}

async function renderEditArticlePage(req, res, next) {
    if(!req.session.isAuthenticated) return res.redirect('/auth/login');
    const {id} = req.params;
    if(!id) return res.redirect('/admin/dashboard');

    try{
        const article = await articleModel.getArticleById(id);
        if(article === undefined) return res.redirect('/admin/dashboard');
        const content = await articleModel.readJson(article.filePath);
        if(content === undefined) return res.redirect('/admin/dashboard');
        res.status(200).render('pages/article', {
            title : 'New Article',
            route : '/admin/article/edit/' + id,
            article_title : article.title,
            content : content.content});
    }catch(err){
        next(err);
    }
}

async function newArticle(req, res, next) {
    if(!req.session.isAuthenticated) return res.redirect('/auth/login');
    try{
        const {title, content} = req.body;
        const username = req.session.user.username;
        const path = './public/articles/' + username + '_' + randNumber(10000, 99999) + '.json';
        await articleModel.writeArticleToJson(path, title, content);
        await articleModel.createArticle(title, path, username);
        res.redirect('/admin/dashboard');
    }catch(err){
        next(err);
    }
}

async function editArticle(req, res, next) {
    const {id} = req.params;
    console.log(req.url);
    const {title, content} = req.body;
    try{
        const {filePath} = await articleModel.getArticleById(id);
        await articleModel.editArticleJson(filePath, title, content, id);
        res.redirect('/admin/dashboard');
    }catch (err) {
        next(err);
    }
}

async function deleteArticle(req, res, next) {
    if(!req.session.isAuthenticated) return res.redirect('/auth/login');
    try{
        const {id} = req.params;
        const {filePath} = await articleModel.getArticleById(id);
        await articleModel.deleteArticleJson(filePath);
        await articleModel.deleteArticleDbs(id);
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
    deleteArticle,
    editArticle,
};