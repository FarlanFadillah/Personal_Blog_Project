const {rateLimit} = require('express-rate-limit');
const {log} = require('../utils/logger')
const {addMessage} = require("../utils/flashMessage");
const loginLimiter = rateLimit({
    windowMs : 10 * 60 * 1000,
    limit : 1,
    handler : (req, res, next, options)=>{
        const now = Date.now(); // current millisecond
        const remaining = (req.rateLimit.resetTime - now) / 1000 / 60; // remaining reset time
        log(req, 'warning', 'To many requests', {module : 'login limiter'});
        addMessage(req,  'warning', `To many request, please try again in ${Math.ceil(remaining)} minutes`);
        res.redirect('/auth/login');
    }
});

module.exports = {
    loginLimiter
};