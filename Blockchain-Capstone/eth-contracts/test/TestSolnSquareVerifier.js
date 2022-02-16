const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const Verifier = artifacts.require("Verifier");

const proof39 = require('./proof_3_9.json');

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    
    const proof = proof39.proof;
    const inputs = proof39.inputs;
    
    const NAME = "Test token";
    const SYMBOL = "TT0";
    
    describe("Setup - SolnSquareVerifier", function () {
        beforeEach(async function () {
            const VerifierCon = await Verifier.new({from: account_one});
            this.contract = await SolnSquareVerifier.new(VerifierCon.address, NAME, SYMBOL, {from: account_one});
        });

        it("Should test adding a solution:", async function () {
            let result = false;
            await this.contract.addSolution(proof.a, proof.b, proof.c, inputs, {from: account_one});

            try {
                await this.contract.addSolution(proof.a, proof.b, proof.c, inputs, {from: account_one});
            } catch (error) {
                result = true;
            }
            assert.equal(result, true, "Solution was added correctly.");
        });

        it("Should test minting a token:", async function () {
            await this.contract.mintNewNFT(account_two, 1, proof.a, proof.b, proof.c, inputs, {from: account_one});
            let owner = await this.contract.ownerOf(1);
            assert.equal(owner, account_two, "Token can be minted correctly.");
        });
    });
});