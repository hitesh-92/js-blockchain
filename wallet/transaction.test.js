const Transaction = require('./transaction')
const Wallet = require('./index')

describe("Transaction", () => {

    let transaction, wallet, recipient, amount

    beforeEach(() => {
        wallet = new Wallet()
        amount = 50
        recipient = "r3c1p13nt"
        transaction = Transaction.newTransaction(wallet, recipient, amount)
    })

    it("outputs 'amount' subtracted from wallet balance", () => {
        const walletAmount = transaction.outputs.find(output => output.address === wallet.publicKey).amount
        const newBalance = wallet.balance - amount

        expect(walletAmount).toEqual(newBalance)
    })

    it("outputs the 'amount' added to the recipient", () => {
        const recipientAmount = transaction.outputs.find(output => output.address == recipient).amount

        expect(recipientAmount).toEqual(amount)
    })

    it("inputs balance of wallet", () => {
        expect(transaction.input.amount).toEqual(wallet.balance)
    })

    it("validates valid transaction", () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true)
    })

    it("invalidates corrupt transaction", () => {
        transaction.outputs[0].amount = 50000
        expect(Transaction.verifyTransaction(transaction)).toBe(false)
    })

    describe("transaction with amount exceeding balance", () => {

        beforeEach(() => {
            amount = 50000;
            transaction = Transaction.newTransaction(wallet, recipient, amount)
        })

        it("does not create transaction", () => {
            expect(transaction).toEqual(undefined)
        })

    })

})