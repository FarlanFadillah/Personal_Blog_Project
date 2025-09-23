const {rateLimit} = require('express-rate-limit');
const {log} = require('../utils/logger')
const {addMessage} = require("../utils/flashMessage");
const {CustomError} = require("../utils/errors");
const {getRemainingTimeMinute} = require('../utils/datetime_tools');

const loginLimiter = rateLimit({
    windowMs : 10 * 60 * 1000,
    limit : 5,
    skipSuccessfulRequests : true,
    handler : (req, res, next, options)=>{
        next(new CustomError(`To many login attempts, please try again in ${Math.floor(getRemainingTimeMinute(req.rateLimit.resetTime))} minutes`, 'warn'));
    }
});

const change_passwordLimiter = rateLimit({
    windowMs : 10 * 60 * 1000,
    limit : 5,
    handler : (req, res, next, options)=>{
        next(new CustomError(`To many attempts, please try again in ${Math.floor(getRemainingTimeMinute(req.rateLimit.resetTime))} minutes`, 'warn'));
    }
})


module.exports = {
    loginLimiter,
    change_passwordLimiter
};