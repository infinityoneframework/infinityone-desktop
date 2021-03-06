<!-- eslint-disable vue/no-v-html -->
<template>
  <v-card-text>
    <v-form
      ref="form"
    >
      <section
        v-for="(group, inx) in items"
        :key="inx"
        style="width: 100%"
      >
        <div v-text="group.title" />
        <article
          class="px-6 py-3 mt-2 mb-6"
          style="background-color: white"
        >
          <v-row
            v-for="item in groupItems(group.items)"
            :key="item.field"
            dense
            width="100%"
          >
            <v-col
              cols="9"
              style="padding-top: 6px"
            >
              <label
                :for="item.field"
                v-html="item.title"
              />
            </v-col>
            <v-col
              cols="3"
            >
              <v-switch
                v-if="item.field"
                v-model="config[item.field]"
                class="float-right mt-0"
                hide-details
                @change="change(item.field)"
              />
              <v-btn
                v-if="item.button"
                dark
                tile
                small
                width="100"
                color="rgb(160,210,65)"
                class="float-right mt-0"
                @click="method(item.method)"
                v-text="item.button"
              />
            </v-col>
          </v-row>
        </article>
      </section>
    </v-form>
  </v-card-text>
</template>
<script>
  import { sync } from 'vuex-pathify'
  import config from '@/config'
  import ConfigUtil from '@/utils/config-util'
  import { ipcRenderer } from 'electron'

  const debug = false

  export default {
    name: 'GeneralSettings',

    data () {
      return {
        title: this.$t('General Settings'),
        items: [
          { title: this.$t('Appearance'), items: [
            { title: this.$t('Show app icon in system tray'), field: 'trayIcon' },
            { title: `${this.$t('Show sidebar')} (<span class="shortcut">${config.cmdKey}+S</span>)`, field: 'showSidebar' },
            { title: this.$t('Show app unread badge'), field: 'badgeOption' },
            { title: this.$t('Flash taskbar on new message'), field: 'flashTaskbarOnMessage', platforms: ['win32'] },
          ]},
          { title: this.$t('Desktop Notification'), items: [
            { title: this.$t('Show Desktop Notifications'), field: 'showNotification' },
            { title: this.$t('Mute all sounds from InfinityOne'), field: 'silent' },
          ]},
          { title: 'App Updates', items: [
            { title: this.$t('Get beta updates'), field: 'betaUpdate' },
          ]},
          { title: this.$t('Functionality'), items: [
            { title: this.$t('Start app at login'), field: 'startAtLogin'},
            { title: this.$t('Always start minimized'), field: 'startMinimized'},
            // can't get the spell checking compiling. Disabling for now
            // { title: this.$t('Enable Spellchecker (requires restart)'), field: 'enableSpellchecker'},
          ]},
          // { title: this.$t('Add custom CSS'), items: [
          //   { title: this.$t('This will inject the selected css stylesheet in all the added accounts'), button: this.$t('Add'), method: 'add' },
          // ]},
          { title: this.$t('Reset Application Data'), items: [
            { title: this.$t('This will delete all application data including all added accounts and preferencs'), button: this.$t('Reset'), method: 'reset' },
          ]},
        ],
        platform: process.platform,
      }
    },

    computed: {
      trayIcon: {
        get () {
          return this.config().trayIcon
        },
        set (val) {
          this.config().trayIcon = val
        },
      },
      config: sync('settings/config'),
    },

    methods: {
      change (field) {
        this.$store.set(`settings/config@${field}`, this.config[field])
        this.method(field)
      },

      method (action) {
        switch (action) {
          case 'reset':
            ConfigUtil.resetAppSettings()
            break
          case 'add':
            if (debug) { console.log('add action') }
            break
          case 'startAtLogin':
            if (debug) { console.log('startAtLogin clicked', this.config.startAtLogin) }
            ipcRenderer.send('toggleAutoLauncher', this.config.startAtLogin)
            break
          default:
            if (debug) { console.log('default action', action) }
        }
      },

      groupItems (items) {
        return items.filter(item => !item.platforms || item.platforms.includes(this.platform))
      },
    },
  }
</script>
