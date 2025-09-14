const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./db/main.sqlite3', (err) => {
    if(err) console.log(err.message);
    console.log('Users Database Connected');
})

db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                first_name TEXT,
                last_name TEXT,
                email TEXT NULL, 
                isAdmin INT(1) DEFAULT 0, 
                salt TEXT NOT NULL, 
                hash TEXT NOT NULL)`,
        (err)=>{
        if(err) console.log(__dirname, err.message);
    })
})

async function addUser(username, first_name, last_name, email, salt, hash, isAdmin = false){
    return new Promise((resolve, reject)=>{
        // console.log("Adding user");
        db.run('INSERT INTO users (username, first_name, last_name, isAdmin, email, salt, hash) VALUES (?, ?, ?, ?, ?, ?, ?)', [username, first_name, last_name, isAdmin, email, salt, hash], (err)=>{
            if(err) reject(err);
            resolve(null);
        });
    })
}

async function getUser(username){
    return new Promise((resolve, reject)=>{
        // console.log('Getting user');
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, result)=>{
            if(err) reject(err);
            resolve(result);
        })
    })
}


module.exports = {addUser, getUser}