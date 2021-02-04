const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = (env, options) => {
  const prod = options.mode === 'production'

  return {
    mode: 'development',
    devtool: false,
    entry: './resources/index.tsx',
    resolve: { extensions: ['.js', '.tsx'] },
    output: {
      path: `${__dirname}/public`,
      publicPath: '/',
      filename: `bundle${prod ? '.[contenthash:8]' : ''}.js`
    },
    devServer: {
      publicPath: '',
      host: '0.0.0.0',
      historyApiFallback: true,
      proxy: { '/api': 'http://localhost:8000' }
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript', ['@babel/env', { targets: { node: 'current' } }], '@babel/react'],
            plugins: ['@babel/plugin-proposal-optional-chaining', '@babel/proposal-object-rest-spread', '@babel/plugin-proposal-nullish-coalescing-operator']
          }
        }
      }, {
        test: /\.(css|png|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            context: 'resources/assets',
            name: `[path][name]${prod ? '.[contenthash:8]' : ''}.[ext]`
          }
        }
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './resources/assets/index.html' }),
      ...prod ? [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({ patterns: [{ from: 'resources/config' }] }),
        new CompressionWebpackPlugin({ exclude: ['.htaccess', 'web.config', 'index.php'] })
      ] : []
    ]
  }
}
