const request = require('request');
const fs = require('fs');
const writeStream = fs.createWriteStream('index.html');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
console.log("****");
console.log(process.argv[2]);
console.log("****");

request(process.argv[2], (error, response, html) => {
    if (!error && response.statusCode == 200) {

        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const headline = doc.getElementsByClassName('headline')[0].outerHTML;

        var article = "<!DOCTYPE html><html><head>" + "<style>html {background-color: lightgrey; color: black; font-family: gil sans;}</style>" + "</head><body>" + headline;
        el = doc.getElementsByClassName('rich-text-article-body-content')[0].getElementsByTagName('p');
        for (var i = 0; i < el.length; i++) {
            if (el[i].className.startsWith('promo'))
                continue;
            article += el[i].outerHTML;
        }
        article += "</body></html>";
        writeStream.write(article);


    }
});