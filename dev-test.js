// let block = new Block('foo', 'bar', 'zoo', 'baz')
// console.log( block.toString() )
// console.log(Block.genesis().toString())

// let fooBlock = Block.mineBlock( Block.genesis(), 'fooBlockData' );
// console.log( fooBlock.toString() )

// const Blockchain = require('./blockchain')
// const blockchain = new Blockchain()
// for(let i=0; i<10; i++){ blockchain.addBlock(`foo ${i}`) }
// console.log(blockchain)

const Wallet = require('./wallet')
const wallet = new Wallet()
console.log( wallet.toString() )