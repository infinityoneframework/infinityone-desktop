<template>
  <v-navigation-drawer
    v-model="showSidebar"
    mini-variant
    mini-variant-width="60"
    mobile-breakpoint="840"
    dark
    app
  >
    <v-layout
      align-center
      justify-space-between
      column
      fill-height
    >
      <v-list
        class="servers-nav-block pt-0"
        dense
      >
        <server-tab
          v-for="(item, inx) in servers"
          :key="inx"
          :inx="inx"
          :item="item"
          @contextmenu="contextMenu($event)"
        />

        <about-tab />
        <network-error-tab />

        <flex-tab
          v-for="item in topItems"
          :key="item.name"
          :item="item"
        />
      </v-list>
      <v-list
        class="bottom-nav-block"
        justify-end
        dense
      >
        <flex-tab
          v-for="item in items"
          :key="item.title"
          :item="item"
        />
      </v-list>
    </v-layout>
    <context-menu
      v-model="menu"
      :index="menuServerIndex"
    />
  </v-navigation-drawer>
</template>
<script>
  import { get, sync } from 'vuex-pathify'
  import ServerTab from './ServerTab'
  import AboutTab from './AboutTab'
  import FlexTab from './FlexTab'
  import ContextMenu from './ContextMenu'
  import NetworkErrorTab from './NetworkErrorTab'

  export default {
    name: 'Drawer',

    components: {
      ServerTab,
      AboutTab,
      FlexTab,
      ContextMenu,
      NetworkErrorTab,
    },

    data() {
      return {
        items: [
          { icon: 'mdi-reload', title: this.$t('Reload'), id: 'reload' },
          { icon: 'mdi-arrow-left', title: this.$t('Go Back'), id: 'back' },
          { icon: 'mdi-settings', title: this.$t('Settings'), to: '/settings', name: 'settings' },
        ],
        topItems: [
          { icon: 'mdi-plus', title: this.$t('Add Organization'), to: '/organization/new', name: 'add-server' },
        ],
        menuServerIndex: 0,
        menu: false,
      }
    },

    computed: {
      servers: get('settings/servers'),
      showSidebar: sync('settings/config@showSidebar'),
    },

    methods: {
      contextMenu (index) {
        this.menuServerIndex = index
        this.menu = true
      },
    },
  }
</script>
<style lang="sass">
  .nav-tab
    padding-top: 5px
    padding-bottom: 5px
    &.settings
      &.active
        background-color: #ddd
        i.v-icon
          color: black
    &.active
      background-color: #666
  .bottom-nav-block
    padding-bottom: 0 !important
  .servers-nav-block, .bottom-nav-block
    width: 60px
</style>
