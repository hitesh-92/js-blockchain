const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('../blockchain')
const P2pServer = require('./p2p-server')
const Wallet = require('../wallet')
const TransactionPool = require('../wallet/transaction-pool')
const Miner = require('./miner')

const PORT =  process.env.PORT || 3001

const blockchain = new Blockchain()
const wallet = new Wallet()
const tP = new TransactionPool()
const p2pServer = new P2pServer(blockchain, tP)
const miner = new Miner(blockchain, tP, wallet, p2pServer)

app.use(bodyParser.json())

app.get('/blocks', (req,res) => {
    res.json(blockchain.chain)
})

app.post('/mine', (req,res) => {
    const block = blockchain.addBlock(req.body.data)
    console.log(`New Block Added: ${block.toString()}`)

    p2pServer.syncChains()

    res.redirect('/blocks')
})

app.get('/transactions', (req,res) => {
    res.json(tP.transactions)
})

app.post('/transact', (req,res) => {

    const {recipient, amount} = req.body
    const transaction = wallet.createTransaction(recipient, amount, blockchain, tP)

    p2pServer.broadcastTransaction(transaction)

    res.redirect('/transactions')
})

app.get('/public-key', (req,res) => {
    res.json({publicKey: wallet.publicKey})
})

app.get('/mine-transaction', (req,res) => {
    const block = miner.mine()
    console.log(`New Block Added: ${block.toString()}`)
    res.redirect('/blocks')
})

app.listen(PORT, () => console.log(`Running... Port:${PORT}`))
p2pServer.listen()