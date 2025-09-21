const articleModel = require("../models/articlesM");
const asyncHandler = require("../utils/asyncHandler");
const {log} = require("../utils/logger");
const {addMessage} = require("../utils/flashMessage");
const {CustomError} = require('../utils/errors')

const renderNewArticlePage = asyncHandler(async (req, res, next) => {
    res.status(200).render('pages/article_form', {
            title : 'New Article',
            route : '/article/new',
            article_title : null,
            content : null});
});

const renderEditArticlePage = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    if(id === undefined) return next(new Error('Id is not defined'));
    
    const article = await articleModel.getArticleById(id);
    if(!article) return next(new CustomError('Article not found', 'error'));

    const content = await articleModel.readJson(article.filePath);
    if(!content) return next(new CustomError('Content not found', 'error'));

    res.status(200).render('pages/article_form', {
        title : 'Edit Article',
        route : '/article/edit/' + id,
        article_title : article.title,
        content : content.content});
});

const newArticle = asyncHandler(async (req, res, next) => {
    const {title, content} = req.body;
    const username = req.session.user.username;
    const path = './public/articles/' + username + '_' + Date.now() + '.json';

    await articleModel.writeArticleToJson(path, title, content);
    await articleModel.createArticle(title, path, username);

    // flash message
    addMessage(req, 'info', 'Article created');

    // log
    log(req, 'info', 'Article created', {module : 'Article Ctrl'});

    res.redirect('/admin');
});

const editArticle = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    const {title, content} = req.body;
    const {filePath} = await articleModel.getArticleById(id);

    await articleModel.editArticleJson(filePath, title, content, id);

    // flash message
    addMessage(req, 'info', 'Article edited');

    // log
    log(req, 'info', 'Article edited', {module : 'Article Ctrl'});

    res.redirect('/admin');
});

const deleteArticle = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const {filePath} = await articleModel.getArticleById(id);

    await articleModel.deleteArticleJson(filePath);
    await articleModel.deleteArticleDbs(id);

    // flash message
    addMessage(req, 'info', 'Article deleted');

    // log
    log(req, 'info', 'Article deleted', {module : 'Article Ctrl'});

    res.redirect('/admin');
});



module.exports = {
    renderEditArticlePage,
    renderNewArticlePage, 
    editArticle,
    deleteArticle,
    newArticle    
}