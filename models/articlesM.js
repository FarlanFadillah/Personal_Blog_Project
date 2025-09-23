const {readFile, writeFile, unlink} = require('fs');
const {CustomError} = require('../utils/errors');
const db = require('./db');

db.serialize(() => {
    //db.run('PRAGMA foreign_keys = OFF'); // disable during migration to avoid constraint errors
    db.run(`CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        filePath TEXT,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        username TEXT NOT NULL,
        FOREIGN KEY (username) REFERENCES users(username) ON UPDATE CASCADE
    )`, (err) => {
        if (err) return console.error("Create table error:", err.message);

        // db.run(`INSERT INTO articles_new (id, title, filePath, createdAt, updatedAt, username)
        //         SELECT id, title, filePath, createdAt, updatedAt, username FROM articles`, (err) => {
        //     if (err) return console.error("Insert data error:", err.message);

        //     db.run(`DROP TABLE articles`, (err) => {
        //         if (err) return console.error("Drop table error:", err.message);

        //         db.run(`ALTER TABLE articles_new RENAME TO articles`, (err) => {
        //             if (err) return console.error("Rename table error:", err.message);

        //             // Re-enable foreign keys AFTER migration
        //             db.run('PRAGMA foreign_keys = ON', (err) => {
        //                 if (err) return console.error("PRAGMA error:", err.message);

        //                 // Verify foreign keys
        //                 db.all(`PRAGMA foreign_key_list(articles);`, (err, rows) => {
        //                     if (err) console.error("Error checking foreign key list:", err.message);
        //                     else console.log("Foreign keys for articles:", rows);
        //                 });
        //             });
        //         });
        //     });
        // });
    });
});



function getAllArticles() {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, title, createdAt, filePath, username FROM articles', [], (err, rows) => {
            if(err) reject(new CustomError(err.message, 'error'));
            resolve(rows);
        })
    })
}

function getArticleById(id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM articles WHERE id = ?`,[id], (err, row) => {
            if(err) reject(new CustomError(err.message, 'error'));
            resolve(row);
        })
    })
}

function getArticleByAuthorName(authorName){
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM articles WHERE username = ?`, [authorName], (err, rows)=>{
            if(err) reject(new CustomError(err.message, 'error'));
            resolve(rows);
        })
    })
}

const validationColumn = ['id', 'title', 'filePath', 'createdAt', 'updatedAt', 'username'];
function getArticleByIdWithSpecificColumn(id, columns) {

    const filteredColumns = columns.filter(col => validationColumn.includes(col));
    if(!filteredColumns.length) throw new CustomError('No valid columns requested', 'warn');


    return new Promise((resolve, reject) => {
        db.get(`SELECT ${filteredColumns.join(',')} FROM articles WHERE id = ?`,[id], (err, row) => {
            if(err) reject(new CustomError(err.message, 'error'));
            resolve(row);
        })
    })
}
function createArticle(title, path, username) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO articles (title, filePath, createdAt, updatedAt, username) VALUES (?,?,datetime('now', 'localtime'),datetime('now', 'localtime'),?)`,
            [title, path, username],
            function (err) {
                if(err) reject(new CustomError(err.message, 'error'));
                resolve(this.lastID);
            })
    });
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
            if(err) reject(new CustomError(err.message, 'error'));
            resolve(null);
        })
    })
}


function readJson(path){
    return new Promise((resolve, reject)=>{
        readFile(path, 'utf-8', (err, data)=>{
            if(err) reject(new CustomError(err.message, 'error'));
            resolve(JSON.parse(data.toString()));
        })
    })
}

function readJsonKeyValue(path, key){
    return new Promise((resolve, reject)=>{
        readFile(path, 'utf-8', (err, data)=>{
            if(err) reject(new CustomError(err.message, 'error'));
            resolve(JSON.parse(data.toString())[key]);
        })
    })
}

function deleteArticleDbs(id) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM articles WHERE id = ?`,[id], (err) => {
            if(err) reject(new CustomError(err.message, 'error'));
            resolve(null);
        })
    })
}

function deleteArticleJson(path) {
    return new Promise((resolve, reject) => {
        unlink(path, (err)=>{
            if(err) reject(new CustomError(err.message, 'error'));
            resolve(null);
        })
    })
}

async function editArticleJson(path, title, content, id) {
    await writeArticleToJson(path, title, content);
    return new Promise((resolve, reject) => {
        db.run(`UPDATE articles SET title = ?, updatedAt = datetime('now', 'localtime') where id = ?`, [title, id], (err) => {
            if(err) reject(new CustomError(err.message, 'error'));
            resolve(null);
        })
    })
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
    readJsonKeyValue,
    getArticleByIdWithSpecificColumn,
    getArticleByAuthorName
}

