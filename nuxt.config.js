const webpack = require('webpack')
module.exports = {
  mode: 'spa',
  head: { title: 'FFmpeg GLI' }, // Headers of the page
  loading: false, // Disable default loading bar
  build: {
    babel: {
      presets: [],
      plugins: [
        ['@babel/plugin-syntax-dynamic-import']
      ]
    },
    extend (config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.target = 'electron-renderer'
        if (process.env.NODE_ENV === 'DEV') config.devtool = 'inline-source-map'
      }
      config.plugins.push(new webpack.ProvidePlugin({ _: 'lodash', moment: 'moment', Vue: 'vue' }))
    }
  },
  css: ['assets/material-icons.css'],
  dev: process.env.NODE_ENV === 'DEV',
  plugins: ['~/plugins/MuseUI', '~/plugins/vuedraggable']
}
