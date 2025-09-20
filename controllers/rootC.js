const articleModel = require("../models/articlesM");
const asyncHandler = require('../utils/asyncHandler');
const {addMessage} = require('../utils/flashMessage');
const logger = require('../utils/logger');
const rootCtrlLogger = logger.child({module : 'RootCtrl'});
const {makePreviewContent, makeDateString} = require('../utils/string_tools');
const marked = require('marked');

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
    if(!article) return redirectToHome(req, res, 'Article not found', {article_id : id})

    article.createdAt = makeDateString(article.createdAt);
    article.updatedAt = makeDateString(article.updatedAt);

    const content = await articleModel.readJsonKeyValue(article.filePath, 'content');
    if(!content) return redirectToHome(req, res, 'content is deleted or not found');
    res.render('pages/article_view', {article : article, content : marked.parse(content)});
})

function redirectToHome(req, res, msg = null, addition = {}){
    addMessage(req, 'error', msg);
    rootCtrlLogger.error(msg, addition);
    return res.redirect('/home');
}

module.exports = {renderHomePage, renderArticlePage, redirectToHome}