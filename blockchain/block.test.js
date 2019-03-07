const Block = require ('./block')
const {DIFFICULTY} = require('../config')

describe("Block", () => {
    let lastBlock, block, data

    beforeEach(() => {
        lastBlock = Block.genesis()
        data = 'Foo'
        block = Block.mineBlock( lastBlock, data )

    })

    it("sets 'data' to match input", () => {
        expect(block.data).toEqual(data)
    })

    it("sets 'lastHash' to match hash of last block", () => {
        expect(block.lastHash).toEqual(lastBlock.hash)
    })

    it("generates hash which matches difficulty", () => {
        expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY))
    })

})