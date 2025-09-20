const marked = require('marked');
function makePreviewContent(string, length){
    const lastWord = string.lastIndexOf(' ', length);
    return marked.parse(string.slice(0, lastWord) + "...");
}

function makeDateString(date){
    return new Date(date).toDateString() +" "+ new Date(date).toLocaleTimeString();
}

module.exports = {
    makeDateString, makePreviewContent
}