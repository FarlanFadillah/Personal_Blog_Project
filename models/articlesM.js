const sqlite3 = require('sqlite3');
const {readFile, writeFile, unlink} = require('fs');
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
        db.all('SELECT id, title, createdAt, filePath FROM articles', [], (err, rows) => {
            if(err) reject(err);
            resolve(rows);
        })
    })
}

function getArticleById(id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT title, filePath FROM articles WHERE id = ?`,[id], (err, row) => {
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
            resolve(JSON.parse(data.toString()));
        })
    })
}

function readJson(path, key){
    return new Promise((resolve, reject)=>{
        readFile(path, 'utf-8', (err, data)=>{
            if(err) reject(err);
            resolve(JSON.parse(data.toString())[key]);
        })
    })
}

async function deleteArticleDbs(id) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM articles WHERE id = ?`,[id], (err) => {
            if(err) reject(err);
            resolve(null);
        })
    })
}

function deleteArticleJson(path) {
    return new Promise((resolve, reject) => {
        unlink(path, (err)=>{
            if(err) reject(err);
            resolve(null);
        })
    })
}

async function editArticleJson(path, title, content, id) {
    try{
        await writeArticleToJson(path, title, content);
        return new Promise((resolve, reject) => {
            db.run(`UPDATE articles SET title = ? where id = ?`, [title, id], (err) => {
                if(err) reject(err);
                resolve(null);
            })
        })
    }catch (err){
        throw err;
    }
}

module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    writeArticleToJson,
    readJson,
    deleteArticleDbs,
    deleteArticleJson,
    editArticleJson,
}

