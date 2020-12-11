const path = require('path')
const Webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = env => {
  console.log('enviroment____', env)
  return {
    entry: {
      'app': './app.ts',
      'pages/index/index': './pages/index/index.ts'
    },
    context: path.resolve(__dirname, 'src'),
    output: {
      filename: '[name].js',
      path: path.join(__dirname, '/dist'),
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        { test: /\.ts$/, use: 'ts-loader' },
        {
          test: /\.sa|css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap=true']
          })
        },
        {
          test: /\.(json|wxml)$/,
          type: 'javascript/auto',
          use: [{
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }]
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          use: [{
            loader: 'url-loader'
          }]
        },
        {
          test: /\.(png|jpe?g)$/,
          use: [{
            options: {
              limit: 1,
              name: '[path][name].[ext]'
            },
            loader: 'url-loader'
          }]
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].wxss'),
      new Webpack.DefinePlugin({ env: JSON.stringify(env) })
    ]
  }
}
