class Miner{

    constructor(blockchain, transactionPool, wallet, p2pServer){
        this.blockchain =  blockchain
        this.transactionPool = wallet
        this.p2pServer = p2pServer
    }

    mine(){

        const validTransaction = this.transactionPool.validTransactions()
        //reward for miner
        //create block with valid transactions
        //sync chains in p2pServer
        //clear transactions from transactionPool
        //broadcast to other miners to clear their transactionPools

    }

}

module.exports = Miner