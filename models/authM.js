const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./db/main.sqlite3', (err) => {
    if(err) console.log(err.message);
    console.log('Users Database Connected');
    db.run("PRAGMA foreign_keys = ON", (err)=>{
        if(err) console.log(err.message);
    });
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

function addUser(username, first_name, last_name, email, hash, isAdmin = false){
    return new Promise((resolve, reject)=>{
        // console.log("Adding user");
        db.run('INSERT INTO users (username, first_name, last_name, isAdmin, email, hash) VALUES ' +
            '(?, ?, ?, ?, ?, ?)',
            [username, first_name, last_name, isAdmin, email, hash],
            (err)=>{
            if(err){
                if(err.message.includes('UNIQUE')) reject(new Error('User already exists'));
                else reject(err);
            }
            resolve(null);
        });
    })
}

function getUser(username){
    return new Promise((resolve, reject)=>{
        // console.log('Getting user');
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, result)=>{
            if(err) reject(err);
            resolve(result);
        })
    })
}

function getAllUsers() {
    return new Promise((resolve, reject)=>{
        // console.log('Getting user');
        db.all(`SELECT * FROM users`, [], (err, result)=>{
            if(err) reject(err);
            resolve(result);
        })
    })
}

function getUserByEmail(email){
    return new Promise((resolve, reject)=>{
        // console.log('Getting user');
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, result)=>{
            if(err) reject(err);
            resolve(result);
        })
    })
}

function updateUser(old_username, new_username, first_name, last_name, email) {
    return new Promise((resolve, reject)=>{
        db.run(`UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ? WHERE username = ?`, [new_username, first_name, last_name, email, old_username], (err)=>{
            if(err) reject(err);
            resolve(null);
        })
    })
}

function updateOneColumn(username, column, value){
    return new Promise((resolve, reject) =>{
        db.run(`UPDATE users SET ${column} = ? WHERE username = ?`,
            [value, username],
            (err)=>{
            if(err) reject(err);
            resolve(null);
        })
    })
}

function deleteUser(username){
    return new Promise((resolve, reject)=>{
        db.run(`DELETE FROM users WHERE username = ?`, [username], (err, )=>{
            if(err) {
                if(err.message.includes('SQLITE_CONSTRAINT')) reject(new Error("Can't Delete this user"));
                reject(err);
            }
            resolve(null);
        })
    })
}


module.exports = {addUser, getUser, getAllUsers, updateUser, updateOneColumn, deleteUser, getUserByEmail}