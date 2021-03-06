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

    isValidChain(chain){
        //first block equals genesis block
        const sameGenesis = JSON.stringify(chain[0]) == JSON.stringify(Block.genesis())
        if( sameGenesis == false ) return false

        //valid every block thereafter
        for(let i=1; i<chain.length; i++){
            const block = chain[i]
            const lastBlock = chain[i-1]

            const noMatch = block.lastHash !== lastBlock.hash
            const badHash = block.hash !== Block.blockHash(block)
            if(noMatch || badHash) return false
            
            return true
        }
        
    }

    replaceChain(newChain){
        //newChain is longer than current
        const isLonger = newChain.length <= this.chain.length
        //invalid chain
        const invalidChain = this.isValidChain(newChain) == false

        if(isLonger){
            console.log('Recevied chain is not longer than current chain')
            return
        }
        else if (invalidChain){
            console.log('Recevied chain in invalid')
            return
        }
        
        console.log('Recevied chain is valid. Old chain has been replaced')
        this.chain = newChain
    }

}

module.exports = Blockchain
