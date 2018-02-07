const webpack = require('webpack');

module.exports = [
  {
    entry: {
      'vendor':['./app/pixi.min.js', './app/TweenMax.min.js'],
      'app/entry':'./app/entry.js'
    },
    output: {
      path: __dirname + '/build/',
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          /** riotのカスタムタグ処理 */
          test: /\.tag$/,
          enforce: 'pre',
          exclude: /node_modules/,
          use: [
            {
              loader: 'riot-tag-loader',
              options:{
                debug: true
              }
            }
          ]
        },
        {
          /** bubleのトランスパイル */
          test: /\.js|\.tag$/,
          enforce: 'post',
          exclude: /node_modules/,
          use:['buble-loader']
        }
      ]
    },
    resolve: {
      extensions:['.js', '.tag']
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name:'vendor',
        filename:'vendor.js'
      }),
      new webpack.ProvidePlugin({ riot: 'riot' })
    ]
  }
]