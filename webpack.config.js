const APP_FOLDER = 'viper';

const webpack = require('webpack');
const join = require('path').join;
const fs = require('fs');
const console = require('consolemd');
let lastHash = '';

module.exports = env => ({
  entry: {
    bundle: join(__dirname, APP_FOLDER, 'client', 'index.js'),
    sw: join(__dirname, APP_FOLDER, 'client', 'sw.js')
  },
  output: {
    path: join(__dirname, 'public', 'js', '[hash].wp'),
    publicPath: '/js/[hash].wp',
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({warnings: false}),
    function() {
      this.plugin('done', stats => {
        const json = stats.toJson();
        if (lastHash !== json.hash) {
          lastHash = json.hash;
          fs.writeFile(
            join(__dirname, APP_FOLDER, 'stats.json'),
            JSON.stringify(json, null, '  '),
            err => {
              if (err) console.error(' #red(✘) unable to write stats.json');
              else Promise.all(
                json.entrypoints.sw.assets.map(file => new Promise((res, rej) => {
                  fs.readFile(
                    join(__dirname, 'public', 'js', json.hash + '.wp', file),
                    (err, data) => err ? rej(err) : res(data)
                  );
                }))
              )
              .catch(err => console.error(' #red(✘) unable to generate sw.js'))
              .then(files => {
                const content = files.join('\n');
                fs.writeFile(
                  join(__dirname, 'public', 'sw.js'),
                  `const Bundle=${JSON.stringify({
                    assets: json.entrypoints.bundle.assets,
                    hash: json.hash
                  })};\n${content}`,
                  err => {
                    if (err) console.error(' #red(✘) unable to generate sw.js')
                    else console.info(' #green(✔) new */sw.js* available');
                  }
                );
              });
            }
          ); 
        }
      });
    }
  ]
});
