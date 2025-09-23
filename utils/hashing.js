const bcrypt = require('bcrypt');
const {CustomError} = require('../utils/errors');

async function genHashBcrypt(password) {
    const salt = await bcrypt.genSalt(12);
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    })
}
async function passValidate(pass, hash){
    return new Promise((resolve, reject)=>{
        bcrypt.compare(pass, hash, (err, result)=>{
            if(err) reject(err);
            result ? resolve(null) : reject(new CustomError('Password mismatch', 'warn'));
        })
    })
}

// unused pbkdf2-password
// function hash(password) {
//     return new Promise((resolve, reject)=>{
//         hasher({password : password}, (err, pass, salt, hash)=>{
//             if(err) reject(err);
//             resolve({salt, hash});
//         })
//     })
// }
//
// function auth(pass, salt_db, hash_db){
//     return new Promise((resolve, reject)=>{
//         hasher({password: pass, salt : salt_db}, (err, pass, salt, hash)=>{
//             // assert.deepEqual(salt_db, salt);
//             if(err) reject(err);
//             // console.log("password : ", pass)
//             // console.log("new :", hash);
//             // console.log("stored :", hash_db);
//             try {
//                 assert.deepEqual(hash_db, hash);
//                 resolve({success : true, msg : "Password match"});
//             } catch (error) {
//                 reject(new Error('Password Mismatch'));
//             }
//         })
//     })
// }

module.exports = {
    genHashBcrypt,
    passValidate,
}