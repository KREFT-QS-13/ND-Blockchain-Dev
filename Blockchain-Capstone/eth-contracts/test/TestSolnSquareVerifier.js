var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

const proof39 = require('./proof_3_9.json');

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('test solution square verifier', function () {
        beforeEach(async function () { 
            this.contract = await SolnSquareVerifier.deployed();
        });

        it('should add solution', async function () { 
            await this.contract.addSolution(account_one);
            let solutionLength = await this.contract.getSolutionsLength.call();
            assert.equal(solutionLength, 1, "Solution not added.");
        });

        it('should mint a token', async function () { 
            let account_two_balance = await this.contract.balanceOf(account_two);
            assert.equal(account_two_balance, 0, "Wrong balance for account_two, should be 0.");

            await this.contract.mintNewNFT(
                account_two, 
                0, 
                proof39.a,
                proof39.a_p,
                proof39.b,
                proof39.b_p,
                proof39.c,
                proof39.c_p,
                proof39.h,
                proof39.k,
                proof39.inputs, 
                {from: account_one}
            );

            let ownerAddress = await this.contract.ownerOf.call(0, {from: account_one});
            assert.equal(account_two, ownerAddress, "Token not minted or incorect owener.");
        });
    });
});