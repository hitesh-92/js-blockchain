const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('../blockchain')
const P2pServer = require('./p2p-server')

const PORT =  process.env.PORT || 3001

const blockchain = new Blockchain()
const p2pServer = new P2pServer(blockchain)

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

app.listen(PORT, () => console.log(`Running... Port:${PORT}`))
p2pServer.listen()