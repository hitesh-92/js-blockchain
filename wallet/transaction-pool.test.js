const TransactionPool = require('./transaction-pool')
const Transaction = require('./transaction')
const Wallet = require('./index')

describe("TransactionPool", () => {

    let tPool, wallet, transaction
    
    beforeEach(() => {
        tP = new TransactionPool()
        wallet = new Wallet()

        // transaction = Transaction.newTransaction(wallet, 'random-address', 30)
        // tP.updateOrAddTransaction(transaction)
        transaction = wallet.createTransaction('random-address', 30, tP)
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

    describe("mixing valid and corrupt transactions", () => {

        let validTransactions

        beforeEach(() => {
            validTransactions = [...tP.transactions]

            for(let i=0; i<6; i++){
                wallet = new Wallet()
                transaction = wallet.createTransaction(`random-address`, 25, tP)
                if(i%2 == 0) transaction.input.amount = 500000
                else validTransactions.push(transaction)
            }
        })

        it("shows difference between valid and corrupt transaction", () => {
            expect(JSON.stringify(tP.transactions)).not.toEqual(JSON.stringify(validTransactions))
        })

        it("grabs valid transaction", () => {
            expect(tP.validTransactions()).toEqual(validTransactions)
        })

    })

})