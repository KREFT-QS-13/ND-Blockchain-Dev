// const StarNotary = artifacts.require("../contracts/StarNotaryv1.sol");
const StarNotary = artifacts.require("StarNotary");

module.exports = function(deployer) {
  deployer.deploy(StarNotary);
};
