const db = require('./db');
const {CustomError} = require("../utils/errors");

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filePath TEXT,
                uploadedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                username TEXT NOT NULL,
                FOREIGN KEY (username) REFERENCES users(username) ON UPDATE CASCADE
        )`, (err) => {
        if (err) return console.error("Create table error:", err.message);
    });
})


function addImage (filePath, username) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO images (filePath, username) VALUES(?, ?)`, [filePath, username], (err) =>{
            if(err) reject(new CustomError('Failed to upload image', 'error'));
            resolve(null);
        })
    })
}

function getAllImagesByUsername(username) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM images WHERE username = ?`, [username], (err, rows)=>{
            if(err) reject(new CustomError('Failed to get all images', 'error'));
            resolve(rows);
        })
    })
}

module.exports = {
    addImage,
    getAllImagesByUsername,
}