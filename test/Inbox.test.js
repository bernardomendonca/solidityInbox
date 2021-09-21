// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
//importing the exported modules from compile.js
//compile.js exports the ABI(which interfaces with our JS application) and the bytecode (that gets deployed to the chain)
const { interface, bytecode} = require('../compile')

//creating an instance of Web3
const web3 = new Web3(ganache.provider());

//defining the accounts variable so we can use it in beforeEach
let accounts;
let inbox;

const INITIAL_STRING = 'Initializing - First message'

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts()

    // Use one of these accounts to deploy contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments:[INITIAL_STRING] })
        .send({ from: accounts[0], gas:'1000000' })
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    // just by received the hash back (the "receipt") we can guarantee that the test went OK.
    // if it didnt, the await funcation would throw an error, which would cause the test to fail.
    it('can change the message', async () => {
        await inbox.methods.setMessage("new message").send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, "new message");
    });
});