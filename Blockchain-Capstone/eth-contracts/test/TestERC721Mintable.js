var AstroHousing = artifacts.require('AstroHousing');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    const name = "Astro Housing Token";
    const symbol = "AHT";
    const URI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

    describe('Match erc721 spec:', function () {
        beforeEach(async function () { 
            this.contract = await AstroHousing.new(name, symbol, {from: account_one});
            
            await this.contract.mint(account_two, 1);
            await this.contract.mint(account_two, 2);


            // for(let i=1; i<=5; i++) {
            //     if(i%2 === 1) {
            //         await this.contract.mint(account_one, i);
            //     } else {
            //         await this.contract.mint(account_two, i);
            //     }
            // }
        })

        it('Should return total supply:', async function () { 
            let totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply, 2, "The total supply is incorrect.");
        })

        it('Should get token balance:', async function () { 
            let balance = await this.contract.balanceOf(account_two);
            assert.equal(balance, 2, "The balance is incorrect.");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('Should return token URI:', async function () { 
            let tokenURI = await this.contract.tokenURI(1);
            assert.equal(tokenURI, URI+"1", "Incorect URI token.");
        })

        it('Should transfer token from one owner to another:', async function () {
            await this.contract.safeTransferFrom(account_two, account_three, 2, {from: account_two});
            const newOwner = await this.contract.ownerOf(2);
            assert.equal(newOwner, account_three, 'Incorrect new owner.');
        })
    });

    describe('Have ownership properties:', function () {
        beforeEach(async function () { 
            this.contract = await AstroHousing.new(name, symbol, {from: account_one});
        })

        it('Should fail when minting when address is not contract owner:', async function () { 
            try {
                var status = await this.contract.mint(account_three, 3, {from: account_two});
                throw ("No error");
            } catch(error) {
                asssertRes = error === "No error" ? false : true;
                // status = false;
                assert(asssertRes);
            }
            // assert.equal(status, false, "Incorrect address, only contract owner can mint.");
        })

        it('Should return contract owner:', async function () { 
            let owner = await this.contract.getOwnerAddress();
            assert.equal(owner, account_one, "Incorect owner address.");
            await this.contract.transferOwnership(account_two);
            let newOwner = await this.contract.getOwnerAddress();
            assert.equal(newOwner, account_two, "Incorect owner address.");
        })

    });
})