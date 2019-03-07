const Blockchain = require('./blockchain')
const Block = require('./block')

describe("Blockchain", () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain()
    })

    it("starts with genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis())
    })

    it("adds a new block", () => {
        const data = 'barr'
        
        blockchain.addBlock(data)

        const lastBlockPosition = blockchain.chain.length - 1
        const lastBlockData = blockchain.chain[lastBlockPosition].data
        
        expect(lastBlockData).toEqual(data)
    })

})