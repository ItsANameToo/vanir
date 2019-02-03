'use strict'

const Vanir = require('./vanir')
const defaults = require('./defaults')


/**
 * The struct used by the plugin container.
 * @type {VanirDriver}
 */
exports.plugin = {
    pkg: require('../package.json'),
    defaults,
    alias: 'vanir',
    async register (container, options) {
        if (!options.enabled) {
            return
        }
        Vanir.setUp(container, options)
    }
}