const { Transaction, Block, Wallet } = require("./index");

/**
 * =========================
 * Transaction Class
 * =========================
 */

//should return object
test("Transaction should return object", () => {
  let transaction = new Transaction(100, "1234", "5678");
  expect(transaction).toEqual({
    amount: 100,
    payer: "1234",
    payee: "5678",
  });
});

test("Transaction toString Method should be called", () => {
  const result = new Transaction();
  const spy = jest.spyOn(result, "toString");
  result.toString(5, "string");

  // check class method is call or not
  expect(spy).toHaveBeenCalled();
});

/** ---- End Transaction Class ---- */

/**
 * ========================
 * Block Class
 * ========================
 */

//Block should be returning different hashes for every instance called
test("Block should return 2 separate hashes thanks to nonce", () => {
  let blockOne = new Block("", new Transaction(100, "genesis block", "first"));
  let blockTwo = new Block("", new Transaction(100, "genesis block", "first"));

  expect(blockOne).toBeDefined();
  expect(blockTwo).toBeDefined();
  expect(blockOne).not.toBe(blockTwo);
});

//make sure Transaction class method is called and Ne block instance returns object
/*describe("Block Class Should initiate a new Transaction instance && Return object", () => {
      it("should...", () => {
        const toString = (Block.prototype.toString = jest.fn());
        const myNewBlock = new Block("", new Transaction(200, "1234", "5678"));
        const expected = {
          prevHash: "",
          transaction: {
            amount: 200,
            payer: "1234",
            payee: "5678",
          },
          timeStamp: expect.any(Number),
          nonce: expect.any(Number),
        };
        myNewBlock.toString();
    
        expect(toString).toHaveBeenCalledTimes(1);
        expect(myNewBlock).toEqual(expected);
      });
    });*/
/** ------ End Block Class ------ */

//test crypto hash https://stackoverflow.com/questions/64386858/jest-mocking-crypto-hmac-not-working-with-jest-mock

/**
 * ========================
 * Wallet Class
 * ========================
 */
test("Wallet sendMoney() Method should be called", () => {
  const result = new Wallet();
  const spy = jest.spyOn(result, "sendMoney");
  result.sendMoney(5, "string");

  // check class method is call or not
  expect(spy).toHaveBeenCalled();
});

/** ------ End Wallet Class ------ */
