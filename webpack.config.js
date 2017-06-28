const APP_FOLDER = 'viper';

const webpack = require('webpack');
const {join, resolve} = require('path');
const fs = require('fs');

module.exports = (env) => ({
  entry: {
    bundle: join(__dirname, APP_FOLDER, 'client', 'index.js'),
    sw: join(__dirname, APP_FOLDER, 'client', 'sw.js')
  },
  output: {
    path: join(__dirname, 'public', 'js', '[hash]'),
    publicPath: '/js/[hash]',
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    function() {
      this.plugin('done', function(stats) {
        const json = stats.toJson();
        fs.writeFileSync(
          join(__dirname, APP_FOLDER, 'stats.json'),
          JSON.stringify(json, null, '  ')
        );
        const swFile = join(__dirname, 'public', 'js', json.hash, 'sw.js');
        const content = fs.readFileSync(swFile).toString();
        fs.writeFileSync(
          join(__dirname, 'public', 'sw.js'),
          content.replace(
            'addAll([])',
            `addAll(${JSON.stringify(
              json.entrypoints.bundle.assets.concat('/')
            )})`
          )
        );
        fs.unlinkSync(swFile);
      });
    },
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({warnings: false})
  ]
});
