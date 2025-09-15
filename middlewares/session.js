const session = require("express-session");
const process = require('process');
const connectSqlite3 = require('connect-sqlite3')(session);

const SQLiteStore = new connectSqlite3({
    db : 'sessions',
    dir : './db',
    table : 'sessions',
});

// configure session
const my_session = session({
    store: SQLiteStore,
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // one hour
    },
    rolling: true // <---- THIS refreshes the cookie on every response
});

module.exports = my_session;