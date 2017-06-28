const fs = require('fs');
const zlib = require('zlib');

class Compressed {

  constructor(request, response, headers) {
    const acceptEncoding = request.headers['accept-encoding'];
    this.noHeaders = true;
    this.headers = Object.assign({}, headers);
    this.response = response;
    switch (true) {
      case /\bdeflate\b/.test(acceptEncoding):
        this.headers['Content-Encoding'] = 'deflate';
        this.output = zlib.createDeflate();
        this.output.pipe(response);
        break;
      case /\bgzip\b/.test(acceptEncoding):
        this.headers['Content-Encoding'] = 'gzip';
        this.output = zlib.createGzip();
        this.output.pipe(response);
        break;
      default:
        this.output = this.response;
        break;
    }
  }

  write(chunks) {
    if (this.noHeaders) {
      this.noHeaders = false;
      this.response.writeHead(200, this.headers);
    }
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
  return new Compressed(request, response);
};