pragma solidity >=0.4.21 <0.6.0;

import "./verifier.sol";
import "./ERC721Mintable.sol";
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract SolnSquareVerifier is AstroHousing {
    using SafeMath for uint256;

    verifier Verifier;

    struct Solution {
        uint256 index;
        address account;
    }

    uint256 solutionIndex = 0;
    mapping(bytes32=>Solution) solutionSubmitted;
    // Solution[] solution = new Solution[](0);

    event solutionAdded(bytes32 solutionKey, address sender);

    function addSolution(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[2] memory inputs) public {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, inputs));
        solutionSubmitted[key] = Solution(solutionIndex, msg.sender);
        solutionIndex.add(1);
        emit solutionAdded(key, msg.sender);
    }

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function mnitNewNFT(address to, address tokenId, uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[2] memory inputs) public {
        require(Verifier.verifyTx(a, b, c, inputs), true, "Solution is incorrect.");

        addSolution(a, b, c, inputs);
        super.mint(to, tokenId);
    }
}
  


























