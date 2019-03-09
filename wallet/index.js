const ChainUtil = require('../chain-utils')
const {INITIAL_BALANCE} = require('../config')
const Transaction = require('./transaction')

class Wallet{

    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex')
    }

    toString(){
        return `Wallet :-
            publicKey:  ${this.publicKey.toString()}
            balance:    ${this.balance}`;
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash)
    }

    createTransaction(recipient, amount, blockchain, transactionPool){

        this.balance = this.calcualteBalance(blockchain)

        if (amount > this.balance){
            console.log(`Amount:${amount} exceeds balance:${this.balance}`)
            return
        }

        let transaction = transactionPool.existingTransaction(this.publicKey)

        if(transaction){
            transaction.update(this, recipient, amount)
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount)
            transactionPool.updateOrAddTransaction(transaction)
        }

        return transaction
    }

    static blockchainWallet(){
        const blockchainWallet = new this
        blockchainWallet.address = 'blockchain-wallet'
        return blockchainWallet
    }

    calcualteBalance(blockchain){
        let balance = this.balance, transactions = []

        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction)
        }))

        const walletInputTransactions = transactions.filter(transaction => transaction.input.address === this.publicKey)

        let startTime = 0

        if(walletInputTransactions.length > 0){
            const recentInputTransaction = walletInputTransactions.reduce( (prev,current) => prev.input.timestamp > current.input.timestamp ? prev : current )    
            
            balance = recentInputTransaction.outputs.find(output => output.address === this.publicKey).amount
            startTime = recentInputTransaction.input.timestamp
        }

        transactions.forEach(transaction => {

            const greaterTimestamp = transaction.input.timestamp > startTime

            if(greaterTimestamp){
                transaction.outputs.find(output => {
                    if(output.address === this.publicKey) balance += output.amount
                })
            }

        })

        return balance
    }

}

module.exports = Wallet