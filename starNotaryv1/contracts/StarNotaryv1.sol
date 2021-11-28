pragma solidity >=0.4.24;

contract StarNotary {
    string public starName;
    address public starOwner;

    event starClaimed(address owner);

    constructor() public {
        starName = "Awesome Udacity Star!!";
    }

    function claimStar() public {
        starOwner = msg.sender;
        emit starClaimed(starOwner);
    }

    function changeName(string memory _name) public {
        starName = _name;
    }
}