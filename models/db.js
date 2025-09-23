const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/main.sqlite3', sqlite3.OPEN_READWRITE, (err)=>{
    if(err) return console.log(err.message);
    db.run("PRAGMA foreign_keys = ON", (err)=>{
        if(err) console.log(err.message);
    });
    console.log('Database connected successfully.');
})

module.exports = db;

