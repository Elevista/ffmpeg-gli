/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
const electronDebug= require('electron-debug')
const electron =require('electron')
electronDebug({ showDevTools: true })

// Install `vue-devtools`
electron.app.on('ready', async function(){
  const installExtension = require('electron-devtools-installer')
  await installExtension.default(installExtension.VUEJS_DEVTOOLS).catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})

// Require `main` process to boot app
require('./index')