// scripts/deploy.js
async function main() {
    const AIModelMarketplace = await ethers.getContractFactory("AIModelMarketplace");
    const marketplace = await AIModelMarketplace.deploy();
    await marketplace.deployed();
    console.log("Contract deployed to:", marketplace.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  