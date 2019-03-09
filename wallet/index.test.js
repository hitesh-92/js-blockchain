const Wallet = require('./index')
const TransactionPool = require('./transaction-pool')
const Blockchain = require('../blockchain')
const {INITIAL_BALANCE} = require('../config')

describe("Wallet", () => {

    let wallet, tP, blockchain

    beforeEach(() => {
        wallet = new Wallet()
        tP =  new TransactionPool()
        blockchain = new Blockchain()
    })

    describe("creating transaction", () => {

        let transaction, sendAmount, recipient

        beforeEach(() => {
            sendAmount = 50
            recipient = 'random-address'
            transaction = wallet.createTransaction(recipient, sendAmount, blockchain, tP)
        })

        describe("doin the same transaction", () => {
            
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, blockchain, tP)
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

    describe("calculating balance", () => {

        let addBalance, repeatAdd, senderWallet

        beforeEach(() => {
            senderWallet = new Wallet()
            addBalance = 50
            repeatAdd = 4

            for(let i=0; i<repeatAdd; i++) senderWallet.createTransaction(wallet.publicKey, addBalance, blockchain, tP)
            blockchain.addBlock(tP.transactions)
        })

        it("calculate balance for blockchain transactions matching recipient", () => {

            const walletBalance = wallet.calcualteBalance(blockchain)

            expect(walletBalance).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd) )
        })

        it("calculate balance for blockchain transactions matching sender", () => {
            const senderWalletBalance = senderWallet.calcualteBalance(blockchain)

            expect(senderWalletBalance).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd) )
        })

        describe("recipient conducts transaction", () => {

            let subtractBalance, recipientBalance

            beforeEach(() => {
                tP.clear()
                subtractBalance = 100
                recipientBalance = wallet.calcualteBalance(blockchain)
                wallet.createTransaction(senderWallet.publicKey, subtractBalance, blockchain, tP)
                blockchain.addBlock(tP.transactions)
            })

            describe("sender sends another transaction to recipient", () => {

                beforeEach(() => {
                    tP.clear()
                    senderWallet.createTransaction(wallet.publicKey, addBalance, blockchain, tP)
                    blockchain.addBlock(tP.transactions)
                })

                it("calculates recipient balance using most recent transaction", () => {

                    const walletBalance =  wallet.calcualteBalance(blockchain)

                    expect(walletBalance).toEqual(recipientBalance - subtractBalance + addBalance)
                })

            })

        })

    })

})