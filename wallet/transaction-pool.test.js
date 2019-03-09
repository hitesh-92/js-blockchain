const TransactionPool = require('./transaction-pool')
const Transaction = require('./transaction')
const Wallet = require('./index')

describe("TransactionPool", () => {

    let tPool, wallet, transaction
    
    beforeEach(() => {
        tP = new TransactionPool()
        wallet = new Wallet()
        transaction = Transaction.newTransaction(wallet, 'random-address', 30)

        tP.updateOrAddTransaction(transaction)
    })

    it("adds transaction to pool", () => {
        const addedTransaction = tP.transactions.find(t => t.id === transaction.id)
        expect(addedTransaction).toEqual(transaction)
    })

    it("updates transaction in pool", () => {

        const oldTransaction = JSON.stringify(transaction)
        const newTransaction = transaction.update(wallet, 'f00-address', 55)

        tP.updateOrAddTransaction(newTransaction)

        const updatedTransaction = tP.transactions.find(t => t.id === newTransaction.id)

        expect(JSON.stringify(updatedTransaction)).not.toEqual(oldTransaction)
    })

})