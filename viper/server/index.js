// node modules
const viperHTML = require('viperhtml');

// local modules
const cdn = require('./cdn.js');
const indexPage = require('../view/index.js');
const stats = require('../stats.json');

// local variables
const STATIC_ASSET = /^\/(?:js\/|css\/|img\/|assets\/|favicon\.ico|manifest.json|sw.js)/;

// shall we render asynchronously ?
const through = viperHTML.async();
// otherwise we could bind a context or use a wire
// const through = viperHTML.wire();

// a basic one page application
require('http')
  .createServer((req, res) => {
    // static content
    if (STATIC_ASSET.test(req.url)) {
      cdn(req, res);
    }
    // dynamic content
    else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      indexPage(
        through(chunk => res.write(chunk)),
        {
          title: 'viperHTML',
          language: 'en',
          script: `${stats.publicPath}/${stats.assets[0].name}`,
          sw: `/sw.js`,
          style: `
            html {
              font-family: sans-serif;
              text-align: center;
            }`,
          body: [
            // the order is preserved, no matter when async chunks get resolved
            new Promise(res => setTimeout(res, 100, '<h1>')),
            'viperHTML',
            new Promise(res => setTimeout(res, 20, '</h1><hr>')),
            new Promise(res => setTimeout(res, 300, 'does <strong>asynchronous')),
            '</strong> too'
          ]
        }
      )
      .then(() => res.end())
      .catch(err => {console.error(err); res.end();});
    }
  })
  .listen(
    process.env.PORT || 3000,
    process.env.IP || '127.0.0.1',
    function () {
      var addres = this.address();
      console.log(
        `\x1B[1mviperHTML\x1B[0m http://${addres.address}:${addres.port}/`
      );
    }
  );
