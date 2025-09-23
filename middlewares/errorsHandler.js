const {addMessage} = require('../utils/flashMessage')
const {log} = require("../utils/logger");

const urlMap = [
    { url : 'login', redirect : '/auth/login'},
    { url : 'register', redirect : '/auth/register'},
    { url : 'delete', redirect : '/admin'},
    { url : 'settings', redirect : '/auth/settings'},
    { url : 'change-password', redirect : '/auth/settings'}
]

function lastErrorHandler(error, req, res, next) {
    // flash message
    addMessage(req, error.type, error.message);

    // log
    log(req, 'error', error.message);
    console.log('[ERROR HANDLER]', req.method, req.originalUrl);
    res.status(400).send(error.message);
}

function articleErrorHandler(error, req, res, next) {
    // flash message
    addMessage(req, error.type, error.message);

    // log
    log(req, 'error', error.message, {module : 'Article Router'});
    res.redirect('/admin');
}


function adminErrorHandler(error, req, res, next) {
    // flash message
    addMessage(req, error.type, error.message);

    // log
    log(req, 'error', error.message, {module : 'Admin Router'});
    res.redirect('/admin');
}


function authErrorHandler (error, req, res, next) {
    // flash message
    addMessage(req, error.type, error.message);

    // log
    log(req, 'error', error.message, {module : 'Auth Router'});

    const matched = urlMap.find(({url}) => req.originalUrl.includes(url))
    if(matched) {
        return res.redirect(matched.redirect);
    }
    next(error);
}

function rootErrorHandler (error, req, res, next) {
    // flash message
    addMessage(req, error.type, error.message);

    // log
    log(req, 'error', error.message, {module : 'Root Router'});
    res.redirect('/home');
}

module.exports = {
    lastErrorHandler,
    authErrorHandler,
    adminErrorHandler,
    rootErrorHandler,
    articleErrorHandler
};