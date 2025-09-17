const {validationResult,} = require('express-validator');
const {addMessage} = require("../utils/flashMessage");

function validatorErrorHandler (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation error occured :');
        for(errMsg of errors.array()) {
            console.log(errMsg);
            addMessage(req, 'error', errMsg.msg);
        }
        return next(new Error("Validation failed."));
    }
        return next();
}

module.exports = {
    validatorErrorHandler
};