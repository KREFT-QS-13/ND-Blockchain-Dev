pragma solidity >=0.4.21 <0.6.0;
// pragma experimental ABIEncoderV2;

import "./Verifier.sol";
import "./ERC721Mintable.sol";
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract SolnSquareVerifier is AstroHousing {
    Verifier VerifierAcc;

    struct Solution {
        uint256 index;
        address account;
    }

    uint256 solutionIndex = 0;
    mapping(bytes32=>Solution) private solutionSubmitted;
    Solution[] private solutions;

    event solutionAdded(uint256 solutionKey, address sender);
    
    function getSolutionsLength() public view returns(uint256) {
        return solutions.length;
    }

    using SafeMath for uint256;
    function addSolution(address Solver) public returns(uint256) {
        Solution memory newSolution = Solution({index: solutionIndex, account: Solver});
        solutions.push(newSolution);

        emit solutionAdded(newSolution.index, newSolution.account);
        
        uint256 currentIndex = solutionIndex;
        solutionIndex.add(1);

        return currentIndex;
    }

    function mintNewNFT(
        address to, 
        uint256 tokenId, 
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory inputs 
    ) public {
        bytes32 key = keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, inputs));

        require((solutionSubmitted[key].index == 0) && (solutionSubmitted[key].account == address(0)), "Solution already used.");
        // require(VerifierAcc.verifyTx(a, a_p, b, b_p, c, c_p, h, k, inputs), "The proof is incorrect.");

        uint256 index = addSolution(to);
        solutionSubmitted[key] = solutions[index];
        super.mint(to, tokenId);
    }
}