const articleModel = require("../models/articlesM");
const asyncHandler = require('../utils/asyncHandler');
const marked = require("marked");
const {addMessage} = require('../utils/flashMessage');

const renderHomePage = asyncHandler(async (req, res, next) => {
    const articles = await articleModel.getAllArticles();

    for(const article of articles){
        const content = await articleModel.readJsonKeyValue(article.filePath, 'content');
        article.content = makePreviewContent(content, 75);
    }
    res.status(200).render('pages/home', {articles : articles});
});

const renderArticlePage = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const article = await articleModel.getArticleByIdWithSpecificColumn(id,
        ['id', 'title', 'createdAt', 'updatedAt', 'username', 'filePath']);
    if(!article) return redirectToHome(req, res, 'content not found')

    article.createdAt = makeDateString(article.createdAt);
    article.updatedAt = makeDateString(article.updatedAt);

    const content = await articleModel.readJsonKeyValue(article.filePath, 'content');
    if(!content) return redirectToHome(req, res, 'content is deleted or not found');
    res.render('pages/article_view', {article : article, content : marked.parse(content)});
})

function makePreviewContent(string, length){
    const lastWord = string.lastIndexOf(' ', length);
    return marked.parse(string.slice(0, lastWord) + "...");
}

function makeDateString(date){
    return new Date(date).toDateString() +" "+ new Date(date).toLocaleTimeString();
}

function redirectToHome(req, res, msg = null){
    addMessage(req, 'error', msg);
    return res.redirect('/home');
}

module.exports = {renderHomePage, renderArticlePage, redirectToHome}