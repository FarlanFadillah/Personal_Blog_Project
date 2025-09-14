const sqlite3 = require('sqlite3');
const {readFile, writeFile} = require('fs');
const db = new sqlite3.Database('./db/main.sqlite3', (err) => {
    if(err) console.log(err.message);
    console.log('Articles Database Connected');
})

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                filePath TEXT NULL,
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL,
                username TEXT NOT NULL,
                FOREIGN KEY (username) REFERENCES users(username) 
                )`,
        (err)=>{
            if(err) console.log(__dirname, err.message);
        })
})


function getAllArticles() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM articles', [], (err, rows) => {
            if(err) reject(err);
            resolve(rows);
        })
    })
}

function getArticleById(id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT id FROM articles WHERE id = ?`,[id], (err, row) => {
            if(err) reject(err);
            resolve(row);
        })
    })
}

async function createArticle(title, path, username) {
    try{
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO articles (title, filePath, createdAt, updatedAt, username) VALUES (?,?,datetime('now', 'localtime'),datetime('now', 'localtime'),?)`,
                [title, path, username],
                function (err) {
                    if(err) reject(err);
                    resolve(this.lastID);
                })
        })
    }catch(err){
        throw err;
    }
}

function writeArticleToJson(path, title, content) {
    return new Promise((resolve, reject) => {
        const article = {
            title: title,
            content : content,
            status : "published"
        }
        const jsonString = JSON.stringify(article, null, 2);
        writeFile(path, jsonString, (err) => {
            if(err) reject(err);
            resolve(null);
        })
    })
}


function readJson(path){
    return new Promise((resolve, reject)=>{
        readFile(path, 'utf-8', (err, data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}

function writeJson(path, data){
    return new Promise((resolve, reject)=>{

    })
}

async function getArticles(path){
    try {
        const articles = await readJson(path);
        return new Promise((resolve, reject)=>{

        })
    }catch(err){

    }
}

module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    writeArticleToJson
}

