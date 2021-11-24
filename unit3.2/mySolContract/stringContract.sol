pragma solidity >=0.4.24;

contract StringContract {

    function StringValueIndex(string memory s, uint index) public pure returns(bytes1 value){
        bytes memory bytes_of_string = bytes(s);
        if (bytes_of_string.length != 0){
            return bytes_of_string[index];
        }
        // TODO: Handle the errors 
    }
}