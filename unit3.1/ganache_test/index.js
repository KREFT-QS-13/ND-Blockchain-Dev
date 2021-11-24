var Web3 = require("web3");
var web3 = new Web3('HTTP://127.0.0.1:7545');

web3.eth.getTransactionCount("0x86Aa69e712238715f2276162D8D8c912293b21f0").then(console.log);