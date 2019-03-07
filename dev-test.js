const Blockchain = require('./blockchain')

// let block = new Block('foo', 'bar', 'zoo', 'baz')
// console.log( block.toString() )
// console.log(Block.genesis().toString())

// let fooBlock = Block.mineBlock( Block.genesis(), 'fooBlockData' );
// console.log( fooBlock.toString() )

const blockchain = new Blockchain()

for(let i=0; i<10; i++){

    blockchain.addBlock(`foo ${i}`)

    

}

console.log(blockchain)