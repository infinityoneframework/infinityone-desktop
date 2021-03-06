<template>
  <v-main
    :class="`app-panel video-conference-view ${show}`"
  >
    <v-container
      fluid
      style="height: 100vh; width: 100%"
      class="ma-0 pa-0"
    >
      <webview
        v-if="videoActive"
        id="video-container"
        :class="enabledClass"
        style="height: 100%; width: 100%"
        :src="url"
        :preload="getPreload()"
        disablewebsecurity
        plugings
        remote-module
        partition="persist:webviewsession"
        webpreferences="allowRunningInsecureContent, javascript=yes"
        @close="closeHandler"
        @dom-ready="domReady"
      />
    </v-container>
  </v-main>
</template>
<script>
  import { get, sync } from 'vuex-pathify'
  import path from 'path'

  const debug = false
  const isDev = require('electron-is-dev')
  const name = 'VideoConference'

  export default {
    name: name,

    data: () => ({
      ready: false,
    }),

    computed: {
      ...get('video/*'),
      ...sync('settings', ['videoActive', 'videoClose']),
      ...get('settings', ['lastServerId', 'currentComponent', 'activeServerWebviewSelector']),
      show () {
        return this.currentComponent && this.currentComponent.name === name ? '' : 'inactive'
      },
      enabledClass () {
        return this.currentComponent && this.currentComponent.name === name ? 'enabled' : 'disabled'
      },
    },

    watch: {
      url (current, previous) {
        if (debug) { console.debug('url change', current, previous) }

        if (current && !previous) {
          new URL(current).searchParams.forEach((val, key) => {
            this.$store.set(`video/${key}`, val)
          })
          this.videoActive = true
          if (this.ready) {
            const $el = document.getElementById('video-container')
            if ($el) {
              $el.reload()
            }
          }
        }
      },

      videoClose (current, previous) {
        if (debug) { console.debug('watch videoActive', current, previous) }

        if (current && !previous) {
          const $el = document.querySelector('webview#video-container')
          if (debug) { console.debug('closing tab', $el) }

          this.videoClose = false

          if ($el) {
            $el.executeJavaScript('window.jitsiApi.executeCommand("hangup")')
          } else {
            console.warn('cannot find video container')
          }
        }
      }
    },

    methods: {
      getPreload () {
        let preload

        if (isDev) {
          preload = path.join(process.cwd(), 'src', 'preload.js')
        } else {
          preload = path.join(__dirname, 'preload.js')
        }
        return `file://${preload}`
      },

      closeHandler () {
        const $el = document.querySelector('webview#video-container')

        if ($el) {
          if (debug) { console.debug('closeHandler', $el) }
          this.videoActive = false
          this.$store.set('video/url', null)
          this.$router.push({ path: `/server/${this.lastServerId}` })
        } else {
          console.warn('cannot find video container')
        }
      },

      domReady () {
        this.ready = true
      },
    },
  }
</script>
<style lang="sass" scoped>
  #video-container
    height: 100vh
    width: 100%
</style>
