'use strict'

import { ipcRenderer } from 'electron'
import url from 'url'
import ConfigUtil from '@/utils/config-util'
import Helpers from './helpers'

const debug = false

if (debug) { console.debug('before node-mac-notifier') }
const MacNotifier = require('node-mac-notifier')

let replyHandler
let clickHandler

class DarwinNotification {
	constructor(title, opts) {
		if (DarwinNotification.permission === 'denied') {
			return
		}

		const silent = ConfigUtil.getConfigItem('silent') || false
		const { host, protocol } = location
		const { icon } = opts
		const profilePic = url.resolve(`${protocol}//${host}`, icon)

		this.tag = opts.tag
		const notification = new MacNotifier(title, Object.assign(opts, {
			bundleId: Helpers.appId,
			canReply: false,
			silent,
			icon: profilePic,
			subtitle: opts.subtitle
		}))

		notification.addEventListener('click', () => {
			// focus to the server who sent the
			// notification if not focused already
			if (clickHandler) {
				clickHandler()
			}

			Helpers.focusCurrentServer()
			ipcRenderer.send('focus-app')
		})

		notification.addEventListener('reply', this.notificationHandler)
	}

	static requestPermission() {
		return // eslint-disable-line no-useless-return
	}

	// Override default Notification permission
	static get _permission() {
		return ConfigUtil.getConfigItem('showNotification') ? 'granted' : 'denied'
	}

	set onreply(handler) {
		replyHandler = handler
	}

	get onreply() {
		return replyHandler
	}

	set onclick(handler) {
		clickHandler = handler
	}

	get onclick() {
		return clickHandler
	}

	// not something that is common or
	// used by infinityone server but added to be
	// future proff.
	addEventListener(event, handler) {
		if (event === 'click') {
			clickHandler = handler
		}

		if (event === 'reply') {
			replyHandler = handler
		}
	}

	notificationHandler({ response }) {
		response = Helpers.parseReply(response)
		Helpers.focusCurrentServer()
		Helpers.setupReply(this.tag)

		if (replyHandler) {
			replyHandler(response)
			return
		}

		Helpers.customReply(response)
	}

	// method specific to notification api
	// used by infinityone
	close() {
		return // eslint-disable-line no-useless-return
	}
}

export default DarwinNotification
