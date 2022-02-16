pragma solidity >=0.4.21 <0.6.0;
// pragma experimental ABIEncoderV2;

import "./Verifier.sol";
import "./ERC721Mintable.sol";
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract SolnSquareVerifier is AstroHousing {
    Verifier VerifierAcc;

    constructor(address verifierAddress, string memory name, string memory symbol) public AstroHousing(name, symbol) {
        VerifierAcc = Verifier(verifierAddress);
    }

    struct Solution {
        uint256 index;
        address account;
    }

    uint256 solutionIndex = 1;
    mapping(bytes32=>Solution) private solutionSubmitted;

    event solutionAdded(bytes32 solutionKey, address sender);

    using SafeMath for uint256;
    function addSolution(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory inputs) public {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, inputs));
        require(solutionSubmitted[key].index == 0, "Solution already exists");
        solutionSubmitted[key] = Solution({index: solutionIndex, account: msg.sender});
    
        solutionIndex.add(1);

        emit solutionAdded(key, msg.sender);
    }

    function mintNewNFT(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory inputs) public {
        require(VerifierAcc.verifyTx(a, b, c, inputs), "Solution is incorrect");

        addSolution(a, b, c, inputs);
        super.mint(to, tokenId);
    }
}