require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28", // Установите правильную версию
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x5ecb91cc7516f27cf26d1722a8679be947015358bb426868f4235fe414500e00"
      ],
    },
  },  
};
