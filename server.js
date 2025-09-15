const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const process = require('process');
const path = require('path');

// custom module
// router modules
const authRouter = require('./routes/authR');
const dashboardRouter = require('./routes/adminR');
const homeRouter = require('./routes/homeR');

// middleware modules
const session = require('./middlewares/session');
const errorHandler = require('./middlewares/errors');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public/static')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(session);

app.use('/auth', authRouter);
app.use('/admin', dashboardRouter);
app.use('/home', homeRouter);

app.get('/', (req, res) => {
    if(!req.session.isAuthenticated) return res.redirect('/auth/login');
    res.redirect('/home');
})


// handling the route that does not exist
app.use((req, res)=>{
    // console.log(req.url);
    res.send('oops the route does not exist ');
});


// errors handler middleware
app.use(errorHandler.loginErrorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port http://localhost:${process.env.PORT}`);
});


