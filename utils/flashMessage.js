function addMessage(req, type, text){
    if(!Array.isArray(req.session.messages)){
        req.session.messages = [];
    }
    req.session.messages.push({type, text});
}


module.exports = {addMessage};