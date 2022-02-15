var Verifier = artifacts.require('Verifier');

const proof39 = require("./proof_3_9.json");

contract('Testing verfier', accounts => {
    const account_one = accounts[0];

    describe('check verifier corectness', function() {
        beforeEach(async function() {
            this.contract = await Verifier.new({from: account_one});
        });

        it('sholud test verification with correct proof', async function () {
            let correct_proof = await this.contract.verifyTx.call(
                proof39.a,
                proof39.a_p,
                proof39.b,
                proof39.b_p,
                proof39.c,
                proof39.c_p,
                proof39.h,
                proof39.k,
                proof39.inputs, 
                {from:account_one});
        
            assert.equal(correct_proof, true, "The proof generated with Zokrates is incorrect.");
        });

        it('sholud test verification with incorrect proof', async function () {
            let incorrect_proof = await this.contract.verifyTx.call(
                proof39.a,
                proof39.a_p,
                proof39.b,
                proof39.b_p,
                proof39.c,
                proof39.c_p,
                proof39.h,
                proof39.k,
                [0x3, 0x4],
                {from:account_one});
            
            assert.equal(incorrect_proof, false, "Error: The proof generated with diffrent inputs generated corret.");
        });
    });
});