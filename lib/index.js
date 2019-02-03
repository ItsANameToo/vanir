'use strict'

const Vanir = require('./vanir')
const defaults = require('./defaults')


/**
 * The struct used by the plugin container.
 * @type {VanirDriver}
 */
exports.plugin = {
    pkg: require('../package.json'),
    defaults: defaults,
    alias: 'vanir',
    async register (container, options) {
        Vanir.setUp(container, options)
    }
}