const articleModel = require("../models/articlesM");
const asyncHandler = require("../utils/asyncHandler");
const {redirectToDashboard} = require("../utils/redirects");

const renderNewArticlePage = asyncHandler(async (req, res, next) => {
    res.status(200).render('pages/article_form', {
            title : 'New Article',
            route : '/article/new',
            article_title : null,
            content : null});
});

const renderEditArticlePage = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    if(id === undefined) return redirectToDashboard(res, 'Aricle Controller', 'Id is not defined');
    
    const article = await articleModel.getArticleById(id);
    if(!article) return redirectToDashboard(res, 'Aricle Controller', 'Article not found');

    const content = await articleModel.readJson(article.filePath);
    if(!content) return redirectToDashboard(res, 'Article Controller', 'Content not found');

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
    redirectToDashboard(res, 'Article Controller', 'New Article created successfully');
});

const editArticle = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    const {title, content} = req.body;
    const {filePath} = await articleModel.getArticleById(id);

    await articleModel.editArticleJson(filePath, title, content, id);
    redirectToDashboard(res, 'Article Controller', 'Article edit successfully');
});

const deleteArticle = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const {filePath} = await articleModel.getArticleById(id);

    await articleModel.deleteArticleJson(filePath);
    await articleModel.deleteArticleDbs(id);
    redirectToDashboard(res, 'Article Controller', 'Article deleted successfully');
});



module.exports = {
    renderEditArticlePage,
    renderNewArticlePage, 
    editArticle,
    deleteArticle,
    newArticle    
}