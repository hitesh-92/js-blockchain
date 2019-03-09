const Wallet = require('../wallet')
const Transaction = require('../wallet/transaction')

class Miner{

    constructor(blockchain, transactionPool, wallet, p2pServer){
        this.blockchain =  blockchain
        this.transactionPool = wallet
        this.p2pServer = p2pServer
    }

    mine(){

        const validTransaction = this.transactionPool.validTransactions()
        //reward for miner
        validTransaction.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchain()))

        //create block with valid transactions
        const block = this.blockchain.addBlock(validTransactions)

        //sync chains in p2pServer
        this.p2pServer.syncChains()

        //clear transactions from transactionPool
        his.transactionPool.clear()

        //broadcast to other miners to clear their transactionPools
        
    }

}

module.exports = Miner