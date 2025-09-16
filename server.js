const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const process = require('process');
const path = require('path');

// custom module
// router modules
const authRouter = require('./routes/authR');
const dashboardRouter = require('./routes/adminR');
const rootRouter = require('./routes/rootR');
const articleRouter = require('./routes/articleR');

// middleware modules
const session = require('./middlewares/session');
const errorHandler = require('./middlewares/errors');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public/static')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session);

app.use('/auth', authRouter);
app.use('/admin', dashboardRouter);
app.use('/article', articleRouter);
app.use('/', rootRouter);



// handling the route that does not exist
app.use((req, res)=>{
    res.status(400).send('oops the route does not exist ');
});


// errors handler middleware
app.use(errorHandler.loginErrorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port http://localhost:${process.env.PORT}`);
});


