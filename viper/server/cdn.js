const {join} = require('path');
const tinyCDN = require('tiny-cdn');
module.exports = tinyCDN({
  // where to find source files
  source: join(__dirname, '..', '..', 'public'),
  // where to create compressed version (once per file)
  dest: join(__dirname, '..', '..', 'cdn'),
  // use best compression option (once per file)
  compression: 'best',
  // use an ETAG with a sha256 identifier
  etag: 'sha256',
  // show this content on a 404
  404: {
    html: `<!doctype html>
    <html>
      <head>
        <title>404: File Not Found</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <style>html{font-family:sans-serif;}</style>
      </head>
      <body>
        <h1><img width="24" src="/favicon.ico"> 404: File Not Found</h1>
        <p>The file you are looking for has been removed or it never existed.</p>
        <p><h2><script>document.write(location.pathname);</script></h2></p>
      </body>
    </html>`
  }
});