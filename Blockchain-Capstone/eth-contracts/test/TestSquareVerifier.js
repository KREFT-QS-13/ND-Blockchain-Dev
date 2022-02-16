var Verifier = artifacts.require('Verifier');

const proof39 = require("./proof_3_9.json");

contract('Testing verfier', accounts => {
    
    const account_one = accounts[0];
    const proof = proof39.proof;
    const inputs = proof39.inputs;

    describe('Setup verifier correctness:', function() {
        beforeEach(async function() {
            this.contract = await Verifier.new({from: account_one});
        });

        it('Sholud test verification with correct proof:', async function () {
            let correct_proof = await this.contract.verifyTx.call(proof.a, proof.b, proof.c, inputs, {from:account_one});
        
            assert.equal(correct_proof, true, "Inputs should have been verified.");
        });

        it('Sholud test verification with incorrect proof:', async function () {
            let incorrect_proof = await this.contract.verifyTx.call(proof.a, proof.b, proof.c, ["0x3", "0x4"], {from:account_one});
            
            assert.equal(incorrect_proof, false, "Inputs should not have been verified.");
        });
    });
});