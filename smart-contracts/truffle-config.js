require('babel-register');
require('babel-polyfill');

var args = process.argv.splice(2);

function getAccountIndex(){
    var accountIdx = 0;

    for (var i = 0; i < args.length; i++){
        if (args[i].indexOf("--accountIndex=") === 0){
            accountIdx = parseInt(args[i].substr(args[i].indexOf('=')+1));
            break;
        }
    }
    return accountIdx;
}

function getPrivateKey(){

    for (var i = 0; i < args.length; i++){
        if (args[i].indexOf("--pk=") === 0){
            return args[i].substr(args[i].indexOf('=')+1);
        }
    }
    return "";
}



module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        },
        ropsten: {
            provider: function () {
                var HDWalletProvider = require('truffle-hdwallet-provider');
                var mnemonic = 'everyone play fair game';
                var ropstenProvider = new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/', getAccountIndex());
                console.log("--Ropsten Account Address:", ropstenProvider.getAddress());
                return ropstenProvider;
            },
            gas: 4700000,
            gasPrice: 100000000000,
            network_id: 3 // official id of the ropsten network
        },
        live: {
            provider: function () {
                var WalletProvider = require('./TruffleWalletProvider');
                var privateKey = getPrivateKey();
                if(privateKey) {
                    var liveProvider = new WalletProvider(privateKey, 'https://mainnet.infura.io/');
                    console.log("--Live Account Address:", liveProvider.getAddress());
                    return liveProvider;
                }
            },
            gas: 6700000,
            network_id: 1 // official id of the mainnet network
        }
    },

    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};
