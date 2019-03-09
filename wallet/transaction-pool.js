const Transaction = require('./transaction')

class TransactionPool{

    constructor(){
        this.transactions = []
    }

    updateOrAddTransaction(transaction){
        
        let transactionWithId = this.transactions.find(t => t.id == transaction.id)

        //if transacton does not exist transactionWithId == undefined

        if(transactionWithId) this.transactions[this.transactions.indexOf(transactionWithId)] = transaction
        else this.transactions.push(transaction)
    }

    existingTransaction(address){
        return this.transactions.find(t => t.input.address === address)        
    }

    validTransactions(){
        return this.transactions.filter(transaction => {
            
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount
            }, 0)

            const invalidAmount = transaction.input.amount !== outputTotal
            if (invalidAmount){
                console.log(`Invalid transaction from address:${transaction.input.address}`)
                return
            }

            const signature = Transaction.verifyTransaction(transaction)
            if(!signature){
                console.log(`Invalid signature from ${transaction.input.address}`)
                return
            }

            return transaction
        })
    }
}

module.exports = TransactionPool