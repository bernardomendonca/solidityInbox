const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
    //This is a test wallet  - hardcoded mnemic for testing purposes:
    'trash reward stem glimpse wing lucky pet image chapter power rent potato',
    //From infura.io -> Deploying to the Rinkeby network
    'https://rinkeby.infura.io/v3/0c89aa15791a4b7ea6d0ff52df4719bf'
);

console.log('Fecthing provider');

// This instance of web3 is *completely* enabled for the Rinkeby test network.
const web3 = new Web3(provider);

console.log("create instance of web3");

//The following function exists so we can call an async
const deploy = async () => {
    //obs: Fetchin our mnemonic will fetch the private+public keys, which will give access to several accounts
    // That's why we run getAccounts() and get the first account
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account ', accounts[0]);

    //We need to pass a javascript object, therefore we use JSON.parse
    //We are parsing interface, which came from the compile script
    const result = await new web3.eth.Contract(JSON.parse(interface))
        // .deploy "tells" web3 that we want to deploy a copy of this contract
        .deploy({ data: bytecode, arguments:['Hi there!'] })
        // .send instructs web3 to send out a transacation that creates this contract
        .send({ gas: '1000000', from: accounts[0], gasPrice: '5000000000' });
        //obs.: Calling deploy doesnt deploy anything_ 
        //_It starts to create the object, and send is what triggers the communication with the network

    //It's fundamental to record where the contract got deployed
    //Otherwise... where is it? 
    console.log('Contract deployed to ', result.options.address);
};
deploy();