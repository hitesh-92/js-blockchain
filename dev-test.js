
const Block = require('./block')

// let block = new Block('foo', 'bar', 'zoo', 'baz')
// console.log( block.toString() )
// console.log(Block.genesis().toString())

let fooBlock = Block.mineBlock( Block.genesis(), 'fooBlockData' );
console.log( fooBlock.toString() )