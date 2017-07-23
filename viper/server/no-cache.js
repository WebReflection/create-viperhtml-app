const fs = require('fs');
const compressed = require('./compressed.js');

module.exports = (req, res, file, headers) => {
  fs.readFile(file, 'utf8', flush.bind(
    compressed(req, res, Object.assign({
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'Expires': '-1',
      'Pragma': 'no-cache'
    }, headers))
  ));
};

function flush(err, data) {
  this.write(data);
  this.end();
}