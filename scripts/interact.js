const hre = require("hardhat");

async function main() {
  const contractAddress = "0x514C0430EC2C52A0d1a92678671A5e5B7863c444"; // Contract address
  const Marketplace = await hre.ethers.getContractAt("AIModelMarketplace", contractAddress);

  // Listing a new model
  const tx = await Marketplace.listModel("Test Model", "Description", hre.ethers.utils.parseEther("1"));
  await tx.wait();
  console.log("Model listed!");

  // Retrieving model details (using the getModelDetails function)
  const modelDetails = await Marketplace.getModelDetails(0);
  console.log("Model details:", modelDetails);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
