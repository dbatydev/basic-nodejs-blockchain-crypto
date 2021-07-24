const crypto = require("crypto");

/**
 * @file index.js - Basic BlockChain Example App
 * @author David Baty
 * @see <a href="https://github.com/greatdane89">My Github Profile</a>
 */

/**
 * Class to create transaction, or transfer funds between to wallets
 * @returns {Object} Object containing the amount, the payer/recipient and the payer
 */
class Transaction {
  constructor(amount, payer, payee) {
    /**
     * @property {number} amount - Amount of currency being transferred
     */
    this.amount = amount;
    /**
     * @property {string} payer - Public Key of the Payer/Purchaser
     */
    this.payer = payer;

    /**
     * @property {string} payee - Public Key of the payee/buyer
     */
    this.payee = payee;
  }

  /**
   * @property {function}
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this);
  }
}

/**
 * Class to create a block, a single block on the chain
 * @returns {object} Block containing a transaction instance,
 * @see {Transaction}
 */
class Block {
  constructor(prevHash, transaction, timeStamp) {
    if (timeStamp === undefined) {
      timeStamp = Date.now();
    }
    /**
     * @property {string} prevHash - hash from the previous block to be passed in
     */
    this.prevHash = prevHash;
    /**
     * @property {instance} transaction - new Transaction class instance
     */
    this.transaction = transaction;
    /**
     * @property {timestamp} timeStamp - A general timestamp using  JS Date, first checked if undefined then set date
     */
    this.timeStamp = timeStamp;
  }

  /**
   * @property {method} - Generates a Hash
   * @returns {string} - hash of the block object
   */
  get hash() {
    const str = JSON.stringify(this);
    const hash = crypto.createHash("SHA256");
    hash.update(str).end();
    return hash.digest("hex");
  }
}

/**
 * Class containing the actual block chain
 */
class Chain {
  constructor() {
    /**
     * @property {array} chain - Array containing the blocks. I.E the block chain
     */
    this.chain = [
      // Genesis block or initial block to start the chain
      new Block("", new Transaction(100, "genesisBlock", "init")),
    ];
  }
  /**
   * @property {method} - Most recent block created
   * @returns {object} - block object
   */
  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * @property {method} - computation or puzzle that created random bytes of generated data, which is turned into a string,
   * finally a if/else checks if the string starts with "000" else a recursive function is called.
   * @see https://www.coindesk.com/what-is-proof-of-work
   * @returns {string} - a string of the random bytes starting with 000.
   */
  mine() {
    const buf = crypto.randomBytes(60);
    let attempt = buf.toString("hex");
    console.log(`⛏️  mining...`);
    if (attempt.substr(0, 3) === "000") {
      return true;
    } else {
      this.mine();
    }
  }
  /**
   * @property {method} -
   * @returns {} -
   */
  addBlock(transaction, senderPublicKey, signature) {
    const verify = crypto.createVerify("SHA256");
    verify.update(transaction.toString());

    const isValid = verify.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine();
      this.chain.push(newBlock);
    }
  }
}

/**
 * @instance
 * Singleton instance / initiate the chain instance
 */
Chain.instance = new Chain();

/** Class representing wallet */
class Wallet {
  /**
   *
   * @param {string} publicKey -
   * @param {string} privateKey -
   */
  constructor(publicKey, privateKey) {
    const keyPair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    this.privateKey = keyPair.privateKey;
    this.publicKey = keyPair.publicKey;
  }

  /**
   * @property {method} -
   * @param {number} amount
   * @param {string} recipientPublicKey
   */
  sendMoney(amount, recipientPublicKey) {
    const transaction = new Transaction(
      amount,
      this.publicKey,
      recipientPublicKey
    );

    const sign = crypto.createSign("SHA256");

    sign.update(transaction.toString());

    const signature = sign.sign(this.privateKey);

    Chain.instance.addBlock(transaction, this.publicKey, signature);
  }
}

//example
let a = new Wallet();
let b = new Wallet();

a.sendMoney(20, b.publicKey);
b.sendMoney(500, a.publicKey);

//view the chain
console.log(Chain.instance);

module.exports = {
  Transaction,
  Block,
  Chain,
  Wallet,
};
