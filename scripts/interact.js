const hre = require("hardhat");

async function main() {
  const contractAddress = "0x514C0430EC2C52A0d1a92678671A5e5B7863c444"; // Вставьте адрес контракта 
  const Marketplace = await hre.ethers.getContractAt("AIModelMarketplace", contractAddress);

  // Пример: вызов функции listModel
  const tx = await Marketplace.listModel("Test Model", "Description", hre.ethers.utils.parseEther("1"));
  await tx.wait();
  console.log("Model listed!");

  // Пример: получение данных модели
  const model = await Marketplace.models(0);
  console.log("Model details:", model);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
