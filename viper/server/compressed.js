const fs = require('fs');
const zlib = require('zlib');

class Compressed {

  constructor(request, response, headers) {
    const acceptEncoding = request.headers['accept-encoding'];
    headers = Object.assign({}, headers);
    switch (true) {
      case /\bdeflate\b/.test(acceptEncoding):
        headers['Content-Encoding'] = 'deflate';
        this.output = zlib.createDeflate();
        this.output.pipe(response);
        break;
      case /\bgzip\b/.test(acceptEncoding):
        headers['Content-Encoding'] = 'gzip';
        this.output = zlib.createGzip();
        this.output.pipe(response);
        break;
      default:
        this.output = response;
        break;
    }
    this.response = response;
    this.response.writeHead(200, headers);
  }

  write(chunks) {
    this.output.write(chunks);
  }

  end() {
    if (this.output === this.response) {
      this.response.end();
    } else {
      this.output.flush(() => this.response.end());
    }
  }

}

module.exports = (request, response, headers) => {
  return new Compressed(request, response, headers);
};