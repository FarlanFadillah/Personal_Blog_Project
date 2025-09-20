const logger = require('../utils/logger');
const {addMessage} = require("./flashMessage");

function redirectToDashboard(res, module, msg = 'Redirecting to Dashboard page', addition = {}) {
    logger.info(msg, {module : module, ...addition});
    return res.redirect('/admin');
}

function redirectToHome(req, res, msg = 'Redirection to home page', addition = {}){
    addMessage(req, 'error', msg);
    logger.info(msg);
    return res.redirect('/home');
}


module.exports = {redirectToDashboard, redirectToHome};