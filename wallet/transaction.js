const ChainUtil = require('../chain-utils')
const {MINING_REWARD} = require('../config')

class Transaction{

    constructor(){
        this.id = ChainUtil.id()
        this.input = null
        this.outputs = []
    }

    update(senderWallet, recipient, amount){

        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey)

        if(amount > senderOutput.amount){
            console.log(`Amount: ${amount} exceeds balance`)
            return
        }

        senderOutput.amount = senderOutput.amount - amount

        this.outputs.push({ amount, address: recipient })

        Transaction.signTransaction(this, senderWallet)

        return this

    }

    static newTransaction(senderWallet, recipient, amount){

        // const transaction = new this()

        //block transaction which exceeds current balance
        const exceedsAmount = amount > senderWallet.balance
        if(exceedsAmount){
            console.log(`Transaction Amount:${amount} exceeds current balance:${senderWallet.balance}`)
            return
        }

        const senderDetails = {
            amount: senderWallet.balance - amount,
            address: senderWallet.publicKey
        }

        const recipientDetails = {
            amount,
            address: recipient
        }

        // transaction.outputs.push(...[ senderDetails, recipientDetails ])
        // Transaction.signTransaction(transaction, senderWallet)
        return Transaction.transactionWithOutputs(senderWallet, [senderDetails, recipientDetails])
    }

    static signTransaction(transaction, senderWallet,){

        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }

    }

    static verifyTransaction(transaction){
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        )
    }

    static transactionWithOutputs(senderWallet, outputs){

        const transaction = new this()
        transaction.outputs.push(...outputs)
        Transaction.signTransaction(transaction, senderWallet)
        return transaction
    }

    static rewardTransaction(minerWallet, blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet, [{
            amount: MINING_REWARD,
            address: minerWallet.publicKey
        }])
    }

}

module.exports = Transaction