const Block = require('./block')

class Blockchain{

    constructor(){
        this.chain = [Block.genesis()]
    }

    addBlock(data){
        const lastBlockPosition = this.chain.length - 1
        const lastBlock = this.chain[lastBlockPosition]

        const block = Block.mineBlock( lastBlock, data )
        this.chain.push(block)

        return block
    }

}

module.exports = Blockchain
