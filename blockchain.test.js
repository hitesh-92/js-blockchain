const Blockchain = require('./blockchain')
const Block = require('./block')

describe("Blockchain", () => {
    let blockchain, blockchain2;

    beforeEach(() => {
        blockchain = new Blockchain()
        blockchain2 = new Blockchain()
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

    it("validates valid chain", () => {
        blockchain2.addBlock('foo')

        expect( blockchain.isValidChain( blockchain2.chain ) ).toBe(true)
    })

    it("invalids chain with corrupt gensis block", () => {
        blockchain2.chain[0].data = 'badData'

        expect( blockchain.isValidChain( blockchain2.chain ) ).toBe(false)
    })

    it("invalidates a corrupt chain", () => {
        blockchain2.addBlock('foo')
        blockchain2.chain[1].data = 'notFoo'

        expect( blockchain.isValidChain( blockchain2.chain ) ).toBe(false)
    })

    it("replaces current chain with new valid chain", () => {
        blockchain2.addBlock('Zoo')
        blockchain.replaceChain( blockchain2.chain )

        expect(blockchain.chain).toEqual(blockchain2.chain)
    })

    it("does not replace chain if new chain length invalid", () => {
        blockchain.addBlock('foo')
        //blockchain has 2 blocks. blockchain2 has 1 block
        blockchain.replaceChain( blockchain2.chain )

        expect(blockchain.chain).not.toEqual(blockchain2.chain)
    })

})