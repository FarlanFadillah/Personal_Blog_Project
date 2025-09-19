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
    ]
});


module.exports = logger;