# Vanir

> Forge your own transactions with a public key whitelist

## Installation

### Yarn Install

> This is a temporary install description to make it work with Core v3 until a proper hook is implemented

Install the plugin based on the `v3-extension` branch

```bash
yarn global add https://github.com/ItsANameToo/vanir#feat/v3-extension
```

### Register & Configure Plugin

Edit the plugin config file located at:

`~/.config/ark-core/{mainnet|devnet|testnet}/app.json`

Add the `vanir` configuration to the `core` or `relay` property, depending on how you are running core. Make sure to add it **BEFORE `core-api` gets defined**):

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
            },
            {
                "package": "@arkecosystem/core-api"
            },
            ...
        ]
    }
}
```

You will need to configure this a little bit in order to forge your own transactions.
The configuration includes an `enabled` flag and an array of public keys `publicKeys` that will be used to filter transactions on.
This means that every transaction that is sent to your forger from and address in the public key list will be kept and not broadcasted to the network; hence self-forging the transaction.

From the example config, this will result in the addresses belonging to the specified public key to have its transactions kept and self-forged when they are sent to the node.

**Important:** although `vanir` will keep the transactions it stores from being broadcast by your server, they will still show up in the `api/transactions/unconfirmed` endpoint. This means that if the api on the node is freely available, it is possible that unconfirmed transactions are pulled by other services and will end up being broadcast to the network after all.

### Compendia

For Compendia, please see the earlier v2 release readme as that network is not compatible with Core v3 as of yet.

### Enabling

Before the plugin will be picked up by the core implementation, you need to restart the process.
The easiest way to achieve this is by running the `pm2 restart all` command.
Afterwards you can check if everything is running fine again with the `pm2 logs` command.

It's also possible to restart the services through the `ark` CLI.

### Testing

You can (and SHOULD) test if Vanir is properly configured by sending a transaction to your node from an address belonging to one of the public keys you specified in the configuration.
If properly configured, Vanir will filter that transaction and it will be confirmed in the next block you forge!
If you have the latest version of Vanir installed, the DEBUG logs will show if it has filtered any transactions: `[VANIR] Keeping transaction <tx id> to self forge`.

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
