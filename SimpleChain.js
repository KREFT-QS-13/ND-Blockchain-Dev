const SHA256 = require('crypto-js/sha256');

// TODO: Peer-to-peer consensus algorithm

//  Class with a constructor for block data model       
class Block {
    constructor(data){
        this.hash = "",
        this.height = 0,
        this.body = data,
        this.time = 0,
        this.previousBlockHash = "";
    }
}

/* ===== Blockchain ===================================
|  Class with a constructor for blockchain data model  |
|  with functions to support:                          |
|     - createGenesisBlock()                           |
|     - getLatestBlock()                               |
|     - addBlock()                                     |
|     - getBlock()                                     |
|     - validateBlock()                                |
|     - validateChain()                                |
|  ====================================================*/

class Blockchain{
    constructor(){
        // new chain array
        this.chain = [];

        // add first genesis block
        this.addBlock(createGenesisBlock());
    }
    
    createGenesisBlock(){
        return new Block("This is the very first block in the chain - Genesis block");
    }

    // addBlock method - Add new block
    addBlock(newBlock){
        // add the hash of the previous hash to the new block
        if(this.chain.length > 0){
            newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
        }

        // block height
        newBlock.height = this.chain.length;

        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0,-3);

        // Add the hash of the block
        // SHA256 requires a string of data
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()
        
        // add block to chain
        this.chain.push(newBlock);
    }
}