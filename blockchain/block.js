const ChainUtil = require('../chain-utils')
const {DIFFICULTY, MINE_RATE} = require('../config')


class Block{

    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
        this.difficulty = difficulty || DIFFICULTY
    }

    toString(){
        return `Block :-
            Timestamp:  ${this.timestamp}
            Last Hash:  ${this.lastHash.substring(0, 10)}
            Hash:       ${this.hash.substring(0, 10)}
            Nonce:      ${this.nonce}
            Difficulty: ${this.difficulty}
            Data:       ${this.data}`;
    }

    static genesis(){
        return new this('GenesisTimeStamp', ' --noLastHash--', 'f1r57_h45h', [], 0, DIFFICULTY)
    }

    static mineBlock(lastBlock, data){
        const lastHash =  lastBlock.hash;
        let nonce = 0;
        let hash;
        let timestamp;
        let {difficulty} = lastBlock;

        do{
            nonce++
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty(lastBlock, timestamp)
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty)
        } while (hash.substring(0, difficulty) != '0'.repeat(difficulty))

        return new this(timestamp, lastHash, hash, data, nonce, difficulty)
    }

    static hash(timestamp, lastHash, data, nonce, difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()
    }

    static blockHash(block) {
        const {timestamp, lastHash, data, nonce, difficulty} = block

        return Block.hash(timestamp, lastHash, data, nonce, difficulty)
    }

    static adjustDifficulty(lastBlock, currentTime){
        let {difficulty} = lastBlock;
        const timeTaken = lastBlock.timestamp + MINE_RATE;
        difficulty = timeTaken > currentTime ? ++difficulty : --difficulty;
        return difficulty;
    }

}

module.exports = Block