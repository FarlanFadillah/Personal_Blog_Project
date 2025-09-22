const {createLogger, format, transports} = require('winston');

const logger = createLogger({
    format : format.combine(
        format.timestamp({
            format : ()=>{
                const now = new Date();
                return now.toLocaleString('en-ID', {
                    timeZone : 'asia/Jakarta',
                    hour12 : false
                });
            }
        }),
        format.ms(),
        format.json()
    ),
    transports : [
        new transports.File({filename : './logs/app.log'}),
        new transports.File({filename : './logs/err.log', level : 'warn'}),
    ],
    exceptionHandlers : [
        new transports.File({filename : './logs/exception.log'}),
    ],
    rejectionHandlers : [
        new transports.File({filename : './logs/rejection.log'}),
    ]
});

function log(req, type, message, addition = {}){
    logger.log(type, message, {addition,
        method: req.method,
        url : req.url,
        ip : req.ip,
        reqId : req.id,
        user : req.session.user?.username ?? 'guest',
    })
}

module.exports = {
    logger,
    log
};