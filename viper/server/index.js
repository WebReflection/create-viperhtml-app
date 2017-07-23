// node modules
const viperHTML = require('viperhtml');
const console = require('consolemd');
const {join} = require('path');

// local modules
const cdn = require('./cdn.js');
const compressed = require('./compressed.js');
const noCache = require('./no-cache.js');
const indexPage = require('../view/index.js');
const stats = require('../stats.json');

// local variables
// which asset should be served as static (CDN optimizations)?
const STATIC_ASSET = /^\/(?:js\/|css\/|img\/|assets\/|favicon\.ico|manifest.json)/;

// is this a PWA ? If the file client/sw.js exists we assume it is
const IS_PWA = require('fs').existsSync(join(__dirname, '..', 'client', 'sw.js'));

// if needed, always serve a fresh new Service Worker file
const SW_FILE = /^\/sw\.js(?:\?|#|$)/;

// which bundle file?
const BUNDLE = stats.assets.find(asset => asset.name === 'bundle.js');

// shall we render asynchronously ?
const through = viperHTML.async();
// otherwise we could bind a context or use a wire
// const through = viperHTML.wire();

// App
require('http')
  .createServer((req, res) => {

    // Service Worker
    if (IS_PWA && SW_FILE.test(req.url))
      return noCache(req, res,
        join(__dirname, '..', '..', 'public', 'sw.js'),
        {'Content-Type': 'application/javascript'}
      );

    // static content
    if (STATIC_ASSET.test(req.url))
      return cdn(req, res);
    
    // dynamic HTML content (index only in this case)
    const output = compressed(req, res, {
      'Content-Type': 'text/html'
    });

    indexPage(
      // each resolved chunk will be written right away
      through(chunk => output.write(chunk)),
      {
        title: 'viperHTML',
        language: 'en',
        script: {
          src: `${stats.publicPath}/${BUNDLE.name}`,
          deferred: true
        },
        isPWA: IS_PWA,
        style: viperHTML.minify.css(`
          html {
            font-family: sans-serif;
            text-align: center;
          }`),
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
    .then(() => output.end())
    .catch(err => { console.error(err); res.end(); });
  })
  .listen(
    process.env.PORT || 3000,
    process.env.IP || '0.0.0.0',
    function () {
      var addres = this.address();
      setTimeout(
        console.log,
        1000,
        ` #green(✔) *viperHTML* app http://${
            IS_PWA ? 'localhost' : addres.address
          }:${addres.port}/`
      );
    }
  );
