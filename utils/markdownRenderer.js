const dompurify = require('dompurify');
const {JSDOM} = require('jsdom');
const marked = require('marked');

const DOMPurify = dompurify(new JSDOM('').window);

function renderHtml(markdown) {
    const rawHtml = marked.parse(markdown);

    const safeHtml = DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["style", "iframe", "object", "embed"],
        FORBID_ATTR : ['style', 'class'],
        ALLOW_DATA_ATTR : false // disallow data-* attributes (sometimes abused)
    });
    const dom = new JSDOM(safeHtml);
    const document = dom.window.document;

    // converting image with certain element-wrapper and custom attribute
    imageConvert(document);

    return document.body.innerHTML;
}

function imageConvert(document){
    document.querySelectorAll("img").forEach((img) => {
        const wrapper = document.createElement("p");
        wrapper.classList.add("article-image-wrapper");
        img.classList.add("article-image");
        img.replaceWith(wrapper);
        wrapper.appendChild(img);
    });
}


module.exports = {
    renderHtml
};