var Verifier = artifacts.require('verifier');

const Proof = require("../zokrates/code/squar/proof.json");

contract('verfier', accounts => {
    const account_one = accounts[0];

    describe('check verifier corectness', function() {
        beforeEach(async function() {
            this.contract = await Verifier.new({from: account_one});
        });
    })

    it('sholud test verification with correct proof', async function () {
        // const proof_points = await this.contract.Proof(Proof.proof.a, Proof.proof.b, Proof.proof.c));
        const correct_proof = await this.contract.verifyTx.call(Proof.proof.a, Proof.proof.b, Proof.proof.c, Proof.proof.inputs);

        assert.equal(correct_proof, true, "The proof generated with Zokrates is incorrect.");
    })

    it('sholud test verification with incorrect proof', async function () {
        const correct_proof = await this.contract.verifyTx.call(Proof.proof.a, Proof.proof.b, Proof.proof.c, [0x3, 0x4]);
        
        assert.equal(correct_proof, false, "Error: The proof generated with diffrent inputs generated corret.");

    })
});