const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;

const querystring = require("querystring");
const express = require('express');
const app = express();
const request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

app.use(express.static("./app/public"));
app.get('/', (req, res) => {
    var path = "";


    if (req.url.toString().startsWith('/?latimesURL=')) {

        path += req.url;
        console.log(path);
        pathObj = querystring.decode(path);
        path = pathObj['/?latimesURL'];

        console.log('\nreading from ' + path + '    ...\n');
        var article = "";
        request(path, (error, response, html) => {
            if (!error && response.statusCode == 200) {

                const dom = new JSDOM(html);
                const doc = dom.window.document;
                const headline = doc.getElementsByClassName('headline')[0].outerHTML;

                article += headline;
                el = doc.getElementsByClassName('rich-text-article-body-content')[0].getElementsByTagName('p');
                for (var i = 0; i < el.length; i++) {
                    if (el[i].className.startsWith('promo'))
                        continue;
                    article += "<p style='font-size:22px;'><strong>" + el[i].innerHTML + "<strong></p>";

                }




            }
        });

        setTimeout(() => {

            fs.readFile('index.html', 'utf8', (err, data) => {
                if (err) { console.error(err); return; }

                const index = data;
                res.send(index + article + "</body></html>");
            });
        }, 1000)

    } else {
        fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) { console.error(err); return; }

            const index = data;
            res.send(index + "</body></html>");
        });


    }
});

app.listen(port, () => {
    console.log(`LA Times Paywall Destroyer listening at http://localhost:${port}`)
});

// console.log(module);