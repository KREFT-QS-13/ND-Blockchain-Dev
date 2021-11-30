var SampleToken = artifacts.require("SampleToken");

module.exports = function(deployer) {
  deployer.deploy(SampleToken, "StarTokenUD", "SUD", 18, 1000);
};