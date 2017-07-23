const APP_FOLDER = 'viper';

const webpack = require('webpack');
const {join} = require('path');
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
              const swFile = join(__dirname, 'public', 'js', json.hash + '.wp', 'sw.js');
              if (err) console.error(' #red(✘) unable to write stats.json');
              else fs.readFile(swFile, (err, buffer) => {
                if (err) console.error(' #red(✘) unable to read ' + swFile);
                else fs.writeFile(
                  join(__dirname, 'public', 'sw.js'),
                  `const APPLICATION_BUNDLE = ${JSON.stringify(
                    json.entrypoints.bundle.assets.concat('/')
                  )}\n${buffer}`,
                  err => {
                    if (err) console.error(' #red(✘) unable to write /public/sw.js');
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
