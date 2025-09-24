const articleModel = require("../models/articlesM");
const asyncHandler = require('../utils/asyncHandler');
const {makePreviewContent, makeDateString} = require('../utils/string_tools');
const marked = require('marked');
const {CustomError} = require("../utils/errors");

const {renderHtml} = require('../utils/markdownRenderer')

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
    if(!article) return next(new CustomError('Article not found', 'warn'));

    article.createdAt = makeDateString(article.createdAt);
    article.updatedAt = makeDateString(article.updatedAt);

    const content = await articleModel.readJsonKeyValue(article.filePath, 'content');
    if(!content) return next(new CustomError('content is deleted or not found', 'warn'));

    res.render('pages/article_view', {article : article, content : renderHtml(content)});
})

module.exports = {renderHomePage, renderArticlePage}