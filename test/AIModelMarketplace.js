const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AIModelMarketplace", function () {
    let Marketplace, marketplace, owner, buyer;

    beforeEach(async function () {
        [owner, buyer] = await ethers.getSigners();
        Marketplace = await ethers.getContractFactory("AIModelMarketplace");
        marketplace = await Marketplace.deploy();
        await marketplace.deployed(); 
    });

    it("should allow a user to purchase a model", async function () {
        await marketplace.listModel(
            "Test Model",
            "A test description",
            ethers.utils.parseEther("1")
        );
        await marketplace
            .connect(buyer)
            .purchaseModel(0, { value: ethers.utils.parseEther("1") });
        const isPurchased = await marketplace.purchased(buyer.address, 0);
        expect(isPurchased).to.be.true;
    });

    it("should allow a user to rate a model", async function () {
        await marketplace.listModel(
            "Test Model",
            "A test description",
            ethers.utils.parseEther("1")
        );
        await marketplace
            .connect(buyer)
            .purchaseModel(0, { value: ethers.utils.parseEther("1") });
        await marketplace.connect(buyer).rateModel(0, 5);
        const model = await marketplace.models(0);
        expect(model.totalRating).to.equal(5);
        expect(model.ratingCount).to.equal(1);
    });

    it("should allow the owner to withdraw funds", async function () {
        await marketplace.listModel(
            "Test Model",
            "A test description",
            ethers.utils.parseEther("1")
        );
        await marketplace
            .connect(buyer)
            .purchaseModel(0, { value: ethers.utils.parseEther("1") });

        // Запоминаем баланс владельца до вывода средств
        const initialBalance = await owner.getBalance();

        // Выполняем вывод средств
        await marketplace.connect(owner).withdrawFunds(0);

        // Проверяем, что баланс владельца увеличился
        const finalBalance = await owner.getBalance();
        expect(finalBalance).to.be.gt(initialBalance);
    });

    it("should allow users to get model details", async function () {
        await marketplace.listModel(
            "Test Model",
            "A test description",
            ethers.utils.parseEther("1")
        );

        const modelDetails = await marketplace.getModelDetails(0);

        expect(modelDetails[0]).to.equal("Test Model"); // name
        expect(modelDetails[1]).to.equal("A test description"); // description
        expect(modelDetails[2]).to.equal(ethers.utils.parseEther("1")); // price
        expect(modelDetails[3]).to.equal(owner.address); // creator
    });
});