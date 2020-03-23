# Vanir

> Forge your own transactions with a public key whitelist

## Installation

### Clone

```bash
yarn global add @itsanametoo/vanir
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
        ],
        delegates: 'username' // Optional, a username or list of usernames of delegates whose current status the plugin will check against
    }
```

You will need to configure this a little bit in order to forge your own transactions.
The configuration includes an `enabled` flag and an array of public keys `publicKeys` that will be used to filter transactions on.
This means that every transaction that is sent to your forger from an address in the public key list will be kept and not broadcasted to the network; hence self-forging the transaction.

From the example config, this will result in the addresses belonging to the two specified public keys to have their transactions kept and self-forged when they are sent to the node.

### Enabling

Before the plugin will be picked up by the core implementation, you need to restart the process.
The easiest way to achieve this is by running the `pm2 restart all` command.
Afterwards you can check if everything is running fine again with the `pm2 logs` command.

It's also possible to restart the services through the Core Commander.

### Testing

You can (and SHOULD) test if Vanir is properly configured by sending a transaction to your node from an address belonging to one of the public keys you specified in the configuration.
If properly configured, Vanir will filter that transaction and it will be confirmed in the next block you forge!
If you have the latest version of Vanir installed, the DEBUG logs will show if it has filtered any transactions: `[VANIR] Filtered 1 transaction to self-forge`.

## Update notes

In case of updates, this section will describe the steps needed to successfully update the plugin if there are any additional steps.
In general you can get fetch and install the latest changes of the plugin as follows:

```bash
yarn global upgrade @itsanametoo/vanir
```

## Credits

- [ItsANameToo](https://github.com/itsanametoo)
- [All Contributors](../../contributors)

## License

[MIT](LICENSE) © ItsANameToo
