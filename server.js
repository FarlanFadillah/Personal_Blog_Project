const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const process = require('process');
const path = require('path');
const {randomUUID} = require('crypto')


process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', reason => {
    console.error('Unhandled Rejection:', reason);
});

// util
const {logger} = require('./utils/logger');

// custom module
// router modules
const authRouter = require('./routes/authR');
const dashboardRouter = require('./routes/adminR');
const rootRouter = require('./routes/rootR');
const articleRouter = require('./routes/articleR');


// middleware modules
const session = require('./middlewares/session');
const {updateAccountProfileError,
    loginErrorHandler,
    lastErrorHandler} = require('./middlewares/errorsHandler');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public/static')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session);

// set the request id for logger later
app.use((req, res, next) => {
    req.id = randomUUID();
    next();
})

// logger middleware
app.use((req, res, next)=>{
    logger.info('Incoming Request :', {
        method: req.method,
        url : req.url,
        ip : req.ip,
        reqId : req.id,
    })
    next();
});

// flash message
app.use((req, res, next)=>{
    res.locals.messages = req.session.messages || [];
    req.session.messages = [];
    next();
})
app.use('/auth', authRouter);
app.use('/admin', dashboardRouter);
app.use('/article', articleRouter);
app.use('/', rootRouter);



// handling the route that does not exist
app.use((req, res)=>{
    res.redirect('/home');
});

// errors handler middleware
app.use(lastErrorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port http://localhost:${process.env.PORT}`);
});


