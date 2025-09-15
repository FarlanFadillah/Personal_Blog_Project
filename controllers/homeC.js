const articleModel = require("../models/articlesM");
async function renderHomePage(req, res, next){
    try{
        const articles = await articleModel.getAllArticles();
        res.status(200).render('pages/home', {msg : null, articles : articles});
    }catch(err){
        next(err);
    }
}

module.exports = {renderHomePage}