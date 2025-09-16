const hasher = require('pbkdf2-password')();
const assert = require('assert');

function hash(password) {
    return new Promise((resolve, reject)=>{
        hasher({password : password}, (err, pass, salt, hash)=>{
            if(err) reject(err);
            resolve({salt, hash});
        })
    })
}

function auth(pass, salt_db, hash_db){
    return new Promise((resolve, reject)=>{
        hasher({password: pass, salt : salt_db}, (err, pass, salt, hash)=>{
            // assert.deepEqual(salt_db, salt);
            if(err) reject(err);
            // console.log("password : ", pass)
            // console.log("new :", hash);
            // console.log("stored :", hash_db);
            try {
                assert.deepEqual(hash_db, hash);
                resolve({success : true, msg : "Password match"});
            } catch (error) {
                reject(new Error('Password Mismatch'));
            }
        })
    })
}

module.exports = {
    hash,
    auth
}