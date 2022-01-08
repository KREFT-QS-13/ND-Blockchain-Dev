pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false

    uint256 public constant INSURANCE_MAX_AMOUNT = 1 ether;
    uint256 private constant AIRLINE_REGISTERED_COST = 10 ether;
    uint256 public numberOfRegisteredAirlines = 0;

    struct Airline {
        bool isRegistered;
        string airlineName;
    }

    struct Insurance {
        address passenger;
        string flightNumber; // assuming that any two fightNumbers are totaly different from each other
        uint256 insuranceAmount;
        uint256 claimAmount; 
    }

    struct Flight {
        string flightNumber;
        bool isRegistered;
        uint8 statusCode;
        uint256 updatedTimestamp;        
        address airline;
    }

    struct Passenger {
        address passenger;
        string flightNumber;
    }

    Passenger[] Passengers = new Passenger[](0);

    mapping(address=>Airline) Airlines;
    mapping(bytes32=>Insurance) Insurees;
    mapping(bytes32=>Flight) Flights;
    mapping(address=>mapping(string=>uint256)) Refunds; // address of the passenger => flightNumber => refund amount
    // mapping(address=>bool) AuthorizedUsers;
    // mapping(address=> uint256) private Funding; 

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    event airlineRegistered(address airline, string airlineName);
    event insuranceBought(address insurees, string airlineName);
    event flightRegistered(string flightNumber, address airline);

    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor() public {
        contractOwner = msg.sender;
        // registerAirline("Astro Airline");        
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/
    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() {
        require(operational, "Contract is currently not operational");
        _; 
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier requireIsAirlineRegistered(address _address) {
        require(Airlines[_address].isRegistered, "The airlines is not registered.");
        _;
    }

    modifier MaxInsurance(uint256 value) {
        require(value <= INSURANCE_MAX_AMOUNT, "Maximum value of insurance is 1 ether.");
        _;
    }

    modifier requireBoughtInsurance(address insuree, string flightNumber) {
        bytes32 key = getInsureeKey(insuree, flightNumber);
        require((Insurees[key].passenger == insuree) && (keccak256(abi.encodePacked(Insurees[key].flightNumber)) == keccak256(abi.encodePacked(flightNumber))), "You did not bou insurance for this flight");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() public view returns(bool) {
        return operational;
    }

    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline(address airline, string airlineName) external payable requireIsOperational requireIsAirlineRegistered(msg.sender) {
        // address airlineAddress = msg.sender;
        address airlineAddress = airline;
        
        Airlines[airlineAddress] = Airline(true, airlineName);
        numberOfRegisteredAirlines = numberOfRegisteredAirlines.add(1);

        contractOwner.transfer(AIRLINE_REGISTERED_COST);

        emit airlineRegistered(airlineAddress, airlineName);
    }

   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy(string flightNumber) external payable requireIsOperational MaxInsurance(msg.value) {
        // uint256 timestamp = block.timestamp;
        address insuree = msg.sender;
        uint256 amount = msg.value;
        
        bytes32 key = getInsureeKey(insuree, flightNumber);
        require( (Insurees[key].passenger == 0x0) && (keccak256(abi.encodePacked(Insurees[key].flightNumber)) == keccak256(abi.encodePacked(""))) && (Insurees[key].insuranceAmount == 0) && (Insurees[key].claimAmount == 0), "You have already bought insurance for this flight");

        // claimamount = 1.5 * amount
        Insurees[key] = Insurance(insuree, flightNumber, amount, amount.add(amount.div(2))); 

        Passengers.push(Passenger(insuree, flightNumber));

        fund(amount);

        emit insuranceBought(insuree, flightNumber);
    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees(address insuree, string flightNumber) external requireIsOperational requireBoughtInsurance(insuree, flightNumber) {
       bytes32 key = getInsureeKey(insuree, flightNumber);
       
       Refunds[insuree][flightNumber] = Insurees[key].claimAmount;
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay(address insuree, string flightNumber) external payable requireIsOperational requireBoughtInsurance(insuree, flightNumber) {
        bytes32 key = getInsureeKey(insuree, flightNumber);
        uint256 amount = Refunds[insuree][flightNumber];
        
        insuree.transfer(amount);

        delete Refunds[insuree][flightNumber];
        delete Insurees[key];
    }
    
   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund(uint256 amount) public payable requireIsOperational {
        // uint256 amount = msg.value;
        
        contractOwner.transfer(amount);
    }

    function getFlightKey(address airline, string memory flight, uint256 timestamp) pure internal returns(bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    function getInsureeKey(address insuree, string memory flightNumber) pure internal returns(bytes32) {
        return keccak256(abi.encodePacked(insuree, flightNumber));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() external payable {
        fund(msg.value);
    }

}