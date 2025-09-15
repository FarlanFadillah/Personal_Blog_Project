const articleModel = require("../models/articlesM");
const asyncHandler = require('../utils/asyncHandler');

const renderHomePage = asyncHandler(async (req, res, next) => {
    const articles = await articleModel.getAllArticles();

    for(const article of articles){
        const content = await articleModel.readJson(article.filePath, 'content');
        article.content = makePreviewContent(content, 25);
    }
    
    res.status(200).render('pages/home', {msg : null, articles : articles});
});

function makePreviewContent(string, lenght){
    const lastWord = string.lastIndexOf(' ', lenght);
    return string.slice(0, lastWord) + "...";
}

module.exports = {renderHomePage}