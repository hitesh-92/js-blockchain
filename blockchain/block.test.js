const Block = require ('./block')

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
        const difficulty = block.difficulty
        const blockHashStart = block.hash.substring(0, difficulty)

        expect(blockHashStart).toEqual('0'.repeat(difficulty))
    })

    it("lowers difficulty for slowly mined block", () => {
        const tooLongTime = block.timestamp + 360000
        const adjustedDifficulty = Block.adjustDifficulty(block, tooLongTime)

        expect(adjustedDifficulty).toEqual( --block.difficulty )
    })

    it("raises difficulty for quickly mined blocks", () => {
        const tooQuickTime = block.timestamp + 1
        const adjustedDifficulty = Block.adjustDifficulty(block, tooQuickTime)

        expect(adjustedDifficulty).toEqual( ++block.difficulty )
    })

})