const articleModel = require("../models/articlesM");
const asyncHandler = require("../utils/asyncHandler");

function renderNewArticlePage(req, res) {
    res.status(200).render('pages/article', {
            title : 'New Article',
            route : '/article/new',
            article_title : null,
            content : null});
}

const renderEditArticlePage = asyncHandler(async (req, res, next) => {

    const {id} = req.params;
    if(id === undefined) return redirectToDashboard(res);
    
    const article = await articleModel.getArticleById(id);
    if(!article) return redirectToDashboard(res);

    const content = await articleModel.readJson(article.filePath);

    if(!content) return redirectToDashboard(res);

    res.status(200).render('pages/article', {
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
    redirectToDashboard(res);
});

const editArticle = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    const {title, content} = req.body;
    const {filePath} = await articleModel.getArticleById(id);

    await articleModel.editArticleJson(filePath, title, content, id);
    redirectToDashboard(res);
});

const deleteArticle = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const {filePath} = await articleModel.getArticleById(id);

    await articleModel.deleteArticleJson(filePath);
    await articleModel.deleteArticleDbs(id);
    redirectToDashboard(res);
});

function redirectToDashboard(res){
    return res.redirect('/admin');
}

module.exports = {
    renderEditArticlePage,
    renderNewArticlePage, 
    editArticle,
    deleteArticle,
    newArticle    
}