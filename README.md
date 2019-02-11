# Vanir

> Forge your own transactions with a public key whitelist

## Installation

### Clone

JavaScript (before v2.1)

```bash
cd ~/ark-core/plugins
git clone https://github.com/ItsANameToo/vanir.git
cd vanir
lerna bootstrap
```

---

TypeScript (v2.1 and up)

```bash
cd ~/core/plugins
git clone https://github.com/ItsANameToo/vanir.git
cd vanir
lerna bootstrap
```

### Register Plugin

Edit the plugin config file located at:

* Before v2.1: `~/.ark/config/plugins.js`
* v2.1 and up: `~/.config/ark-core/$network/plugins.js`
    
    `$network` is either `devnet` or `mainnet`

Add the following line to the end of the file (or at least after `core-p2p` gets included):

`'@itsanametoo/vanir': {}`

It will look something like this:

```javascript
module.exports = {
    '@arkecosystem/core-event-emitter': {},
    '@arkecosystem/core-logger-winston': {},
    ...
    '@itsanametoo/vanir': {} // This line is added at the end of the file
}
```

This will add the plugin, but before it can be used you first need to configure it!

### Configure

In the same `plugins.js` file where you added the plugin, you will also need to define the configuration properties.
The configuration includes an `enabled` flag and an array of public keys (`pubkeys`) that will be used to filter transactions on.
An example configuration might look like this:

```javascript
module.exports = {
    '@arkecosystem/core-event-emitter': {},
    '@arkecosystem/core-logger-winston': {},
    ...
    '@itsanametoo/vanir': {
        enabled: true, // Enables the plugin, default value is false
        pubkeys: [ // A list of public keys for which transactions will not be broadcasted
            'pubkey1',
            'pubkey2',
            ...
            'pubkeyn'
        ]
    }
}
```

### Enabling

Before the plugin will be picked up by the core implementation, you need to restart the process.
The easiest way to achieve this is by running the `pm2 restart all` command.
Afterwards you can check if everything is running fine again with the `pm2 logs` command.

It's also possible to restart the services through the Core Commander.

## Credits

- [ItsANameToo](https://github.com/itsanametoo)
- [All Contributors](../../contributors)

## License

[MIT](LICENSE) © ItsANameToo
