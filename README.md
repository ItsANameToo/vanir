# Vanir

> Forge your own transactions with a public key whitelist

## Installation

### Clone

```bash
cd ~/ark-core/plugins
git clone https://github.com/ItsANameToo/vanir.git
cd vanir
lerna bootstrap
```

### Register Plugin

Edit the plugin config file located at:

`~/.config/ark-core/{mainnet|devnet|testnet}/plugins.js`

Add the following snippet to the end of the file (or at least after `core-p2p` gets included):

```javascript
module.exports = {
    '@arkecosystem/core-event-emitter': {},
    '@arkecosystem/core-logger-winston': {},
    ...
    // Snippet to add
    '@itsanametoo/vanir': {
        enabled: true, // Enables the plugin, default value is false
        publicKeys: [ // A list of public keys for which transactions will not be broadcasted
            'examplePublicKey1',
            'examplePublicKey2'
        ]
    }
```

You will need to configure this a little bit in order to forge your own transactions.
The configuration includes an `enabled` flag and an array of public keys `publicKeys` that will be used to filter transactions on.
This means that every transaction that is sent to your forger from and address in the public key list will be kept and not broadcasted to the network; hence self-forging the transaction.

From the example config, this will result in the addresses belonging to the two specified public keys to have their transactions kept and self-forged when they are sent to the node.

### Enabling

Before the plugin will be picked up by the core implementation, you need to restart the process.
The easiest way to achieve this is by running the `pm2 restart all` command.
Afterwards you can check if everything is running fine again with the `pm2 logs` command.

It's also possible to restart the services through the Core Commander.

## Credits

- [ItsANameToo](https://github.com/itsanametoo)
- [All Contributors](../../contributors)

## Update notes

In case of updates, this section will describe the steps needed to successfully update the plugin.

## License

[MIT](LICENSE) © ItsANameToo
