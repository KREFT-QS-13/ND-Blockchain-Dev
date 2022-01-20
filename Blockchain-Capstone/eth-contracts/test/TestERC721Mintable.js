var ERC721MintableComplete = artifacts.require('AstroHousing');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    describe('match erc721 spec', function () {
        before(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            await this.contract.mint(account_one, 5, {from: account_one});
            await this.contract.mint(account_one, 6, {from: account_one});
            await this.contract.mint(account_one, 8, {from: account_one});
            await this.contract.mint(account_three, 4, {from: account_one});
            await this.contract.mint(account_two, 9, {from: account_one});
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply({from: account_one});
            assert.equal(totalSupply, 5, "The total supply is incorrect.");
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf(account_one);
            assert.equal(balance, 3, "The balance is incorrect.");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const tokenURI = await this.contract.tokenURI(7);
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/7", "Incorect URI token.");
        })

        it('should transfer token from one owner to another', async function () { 
            const tansfer = await this.contract._transferFrom(account_one, account_two, 1, {from: account_one});
            const newowner = await this.contract.ownerOf(1);
            assert.equal(newowner, account_two, 'Incorrect new owenr.');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            try {
                var status = await this.contract.mint(account_two, 4, {from: account_one});
            } catch(err) {
                status = false;
            }
            assert.equal(status, false, "Incorrect address, only contract owner can mint.");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwnerAddress();
            assert.equal(owner, account_one, "Incorect owner address.");
        })

    });
})