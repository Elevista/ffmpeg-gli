const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = function (env, { mode = 'development' } = {}) {
  const production = mode === 'production'
  const configs = {
    renderer: {
      name: 'renderer',
      mode,
      target: 'electron-renderer',
      entry: [path.join(__dirname, 'app/renderer.js')],
      module: {
        rules: [
          { test: /\.vue$/, loader: 'vue-loader' },
          { test: /\.css$/, loader: 'vue-style-loader!css-loader' },
          { test: /\.(png|woff|woff2|eot|ttf|svg|jpg|otf|gif)$/, loader: 'file-loader?outputPath=files/' }
        ]
      },
      plugins: [new VueLoaderPlugin(), new webpack.ProvidePlugin({ _: 'lodash', Vue: 'vue', moment: 'moment' })],
      resolve: { alias: { '~': path.resolve(__dirname, 'app') } },
      node: { __dirname: !production, __filename: !production },
      output: {
        filename: 'renderer.js',
        path: path.resolve(__dirname, 'dist'),
      }
    },
    main: {
      name: 'main',
      mode,
      target: 'electron-main',
      entry: path.join(__dirname, 'app/main.js'),
      devtool: production ? false : 'inline-source-map',
      module: {
        rules: [ { test: /\.(png|woff|woff2|eot|ttf|svg|jpg|otf|gif)$/, loader: 'file-loader?outputPath=files/' } ]
      },
      plugins: [],
      node: { __dirname: !production, __filename: !production },
      output: {
        filename: 'main.js',
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, 'dist')
      },
    },
  }
  if (mode === 'production') {
    Object.values(configs).forEach(c => c.plugins.push(new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' })))
  } else {
    configs.renderer.entry.push('webpack-hot-middleware/client?noInfo=true&reload=true')
    configs.renderer.plugins.push(new webpack.HotModuleReplacementPlugin())
  }
  return Object.values(configs)
}
