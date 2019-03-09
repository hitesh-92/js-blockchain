const ChainUtil = require('../chain-utils')

class Transaction{

    constructor(){
        this.id = ChainUtil.id()
        this.input = null
        this.outputs = []
    }

    static newTransaction(senderWallet, recipient, amount){

        const transaction = new this()

        //block transaction which exceeds current balance
        const exceedsAmount = amount > senderWallet.balance
        if(exceedsAmount){
            console.log(`Transaction Amount:${amount} exceeds current balance: ${snederWallet.balance}`)
            return
        }

        const senderDetails = {
            amount: senderWallet.balance - amount,
            address: senderWallet.publicKey
        }

        const recipientDetails = {
            amount,
            recipient
        }

        transaction.outputs.push(...[ senderDetails, recipientDetails ])
        
        return transaction
    }

}

module.exports = Transaction