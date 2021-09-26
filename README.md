# Vanir

> Forge your own transactions with a public key whitelist

## Installation

### Yarn Install

> This is a temporary install description to make it work with Core v3 until a proper hook is implemented

Install the plugin based on the `v3` branch

```bash
yarn global add https://github.com/ItsANameToo/vanir#feat/v3
```

### Core Adjustment

For the time being, you need to make a slight adjustment to core in order to allow the plugin to override the required method. Start by opening the following file:

```bash
nano .config/yarn/global/node_modules/@arkecosystem/core-p2p/dist/service-provider.js
```

Scroll down until you reach the `registerServices()` line, which will be followed by a bunch of `app.bind(...)` instances. Find the one regarding the `TransactionBroadcaster` and add `.inSingletonScope()` to the end of it (to match the other lines). For example this would result in the following change:

```js
// Before
this.app.bind(core_kernel_1.Container.Identifiers.PeerTransactionBroadcaster).to(transaction_broadcaster_1.TransactionBroadcaster);

// After
this.app.bind(core_kernel_1.Container.Identifiers.PeerTransactionBroadcaster).to(transaction_broadcaster_1.TransactionBroadcaster).inSingletonScope();
```

**Note**: this change will not persist when updating core, so make sure to re-apply it when afterwards.

### Register & Configure Plugin

Edit the plugin config file located at:

`~/.config/ark-core/{mainnet|devnet|testnet}/app.json`

Add the `vanir` configuration to the `core` or `relay` property, depending on how you are running core. Make sure to add it at the end of the list (or at least after `core-p2p` gets included):

```json
{
    ...
    "relay": {
        "plugins": [
            {
                "package": "@arkecosystem/core-transaction-pool"
            },
            ...

            // Configuration to add
            {
                "package": "@itsanametoo/vanir",
                "options": {
                    "enabled": true,
                    "publicKeys": [
                        "examplePublicKey"
                    ]
                }
            }
        ]
    }
}
```

You will need to configure this a little bit in order to forge your own transactions.
The configuration includes an `enabled` flag and an array of public keys `publicKeys` that will be used to filter transactions on.
This means that every transaction that is sent to your forger from and address in the public key list will be kept and not broadcasted to the network; hence self-forging the transaction.

From the example config, this will result in the addresses belonging to the specified public key to have its transactions kept and self-forged when they are sent to the node.

### Compendia

When using `vanir` on the Compendia network, you need to perform an additional step for core to pick up the plugin. After globally installing it with `yarn`, you have to move it to the core installation by running `cp -r ~/.config/yarn/global/node_modules/@itsanametoo/ ~/compendia-core/node_modules/`. This will not persist between Compendia core updates, meaning you will have to run the above line after each Compendia update.

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
