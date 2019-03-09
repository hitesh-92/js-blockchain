const Wallet = require('./index')
const TransactionPool = require('./transaction-pool')
const Blockchain = require('../blockchain')

describe("Wallet", () => {

    let wallet, tP, blockchian

    beforeEach(() => {
        wallet = new Wallet()
        tP =  new TransactionPool()
        blockchian = new Blockchain()
    })

    describe("creating transaction", () => {

        let transaction, sendAmount, recipient

        beforeEach(() => {
            sendAmount = 50
            recipient = 'random-address'
            transaction = wallet.createTransaction(recipient, sendAmount, blockchian, tP)
        })

        describe("doin the same transaction", () => {
            
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, blockchian, tP)
            })

            it("doubles 'sendAmount' subtracted from wallet balance", () => {
                const walletAmount = transaction.outputs.find(output => output.address === wallet.publicKey).amount

                expect(walletAmount).toEqual(wallet.balance - sendAmount*2)
            })

            it("clones 'sendAmount' output for recipient", () => {
                const sendAmounts = transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)

                expect(sendAmounts).toEqual([sendAmount, sendAmount])
            })

        })

    })

})