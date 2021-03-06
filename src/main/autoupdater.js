import ConfigUtil from '@/utils/config-util'
import i18n from '@/i18n'

const $t = msg => i18n.t(msg)
const { app, dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
const isDev = require('electron-is-dev')

export function appUpdater() {
  // Don't initiate auto-updates in development
  if (isDev) {
    return
  }

  if (process.platform === 'linux' && !process.env.APPIMAGE) {
    const { linuxUpdateNotification } = require('./linuxupdater')
    linuxUpdateNotification()
    return
  }

  // Create Logs directory
  const LogsDir = `${app.getPath('userData')}/Logs`

  // Log whats happening
  const log = require('electron-log')

  log.transports.file.file = `${LogsDir}/updates.log`
  log.transports.file.level = 'info'
  autoUpdater.logger = log

  // Handle auto updates for beta/pre releases
  autoUpdater.allowPrerelease = ConfigUtil.getConfigItem('betaUpdate') || false
  log.log('allowPrerelease', autoUpdater.allowPrerelease)

  // Ask the user if update is available
  // eslint-disable-next-line no-unused-vars
  autoUpdater.on('update-downloaded', event => {
    // Ask user to update the app
    dialog.showMessageBox({
      type: 'question',
      buttons: [$t('Install and Relaunch'), $t('Install Later')],
      defaultId: 0,
      message: $t('A new update {version} has been downloaded', { version: event.version }),
      detail: $t('It will be installed the next time you restart the application')
    })
      .then(({ response = 1 })  => {
        if (response === 0) {
          log.log('preparing to quit and install')
          setTimeout(() => {
            autoUpdater.quitAndInstall()
            // force app to quit. This is just a workaround, ideally
            // autoUpdater.quitAndInstall() should relaunch the app.
            app.quit()
          }, 1000)
        } else {
          log.log('user canceled preparing to quit and install', response)
        }
      })
      .catch(error => {
        console.warn('showDialog response error', error)
      })
  })

  // Init for updates
  autoUpdater.checkForUpdates()
    .then(result => {
      console.log('[autoUpdater] checkForUpdates result', result)
    })
    .catch(error => {
      console.warn('[autoUpdater] checkForUpdates error', error)
    })
}
