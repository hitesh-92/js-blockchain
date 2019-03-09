const TransactionPool = require('./transaction-pool')
const Transaction = require('./transaction')
const Wallet = require('./index')
const Blockchain = require('../blockchain')

describe("TransactionPool", () => {

    let tP, wallet, transaction, blockchian
    
    beforeEach(() => {
        tP = new TransactionPool()
        wallet = new Wallet()
        blockchian = new Blockchain()

        transaction = wallet.createTransaction('random-address', 30, blockchian, tP)
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

    it("clears transactions", () => {
        tP.clear()

        expect(tP.transactions).toEqual([])
    })

    describe("mixing valid and corrupt transactions", () => {

        let validTransactions

        beforeEach(() => {
            validTransactions = [...tP.transactions]

            for(let i=0; i<6; i++){
                wallet = new Wallet()
                transaction = wallet.createTransaction(`random-address`, 25, blockchian, tP)
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