const {addMessage} = require('../utils/flashMessage')
const logger = require('../utils/logger');




function lastErrorHandler(error, req, res, next) {
    addMessage(req, 'error', error.message);
    logger.error(error.message);
    console.log('[ERROR HANDLER]', req.method, req.originalUrl);
    res.status(400).send(error.message);
}

function articleCtrlErrorHandler(error, req, res, next) {

}

module.exports = {
    lastErrorHandler
};