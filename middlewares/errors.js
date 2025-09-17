const {addMessage} = require('../utils/flashMessage')
function lastErrorHandler(error, req, res, next) {
    addMessage(req, 'error', error.message);
    res.status(400).send(error.message);
}

module.exports = {
    lastErrorHandler
};