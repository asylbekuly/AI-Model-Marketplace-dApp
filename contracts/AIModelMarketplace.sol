// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint8 ratingCount;
        uint16 totalRating;
    }

    Model[] public models;
    mapping(address => mapping(uint256 => bool)) public purchased;

    // Баланс контракта для хранения средств, полученных от покупок
    uint256 public contractBalance;

    // События для логирования
    event ModelListed(uint256 modelId, string name, uint256 price, address creator);
    event ModelPurchased(uint256 modelId, address buyer);
    event ModelRated(uint256 modelId, uint8 rating, address rater);
    event FundsWithdrawn(address creator, uint256 amount);

    // Функция для добавления новой модели
    function listModel(string memory name, string memory description, uint256 price) public {
        require(price > 0, "Price must be greater than zero");
        models.push(Model(name, description, price, payable(msg.sender), 0, 0));
        emit ModelListed(models.length - 1, name, price, msg.sender);
    }

    // Функция для покупки модели
    function purchaseModel(uint256 modelId) public payable {
        require(modelId < models.length, "Model does not exist");
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect payment amount");
        require(!purchased[msg.sender][modelId], "Model already purchased");

        purchased[msg.sender][modelId] = true;

        // Средства сохраняются на контракте, а не переводятся сразу создателю
        contractBalance += msg.value;

        emit ModelPurchased(modelId, msg.sender);
    }

    // Функция для оценки модели
    function rateModel(uint256 modelId, uint8 rating) public {
        require(modelId < models.length, "Model does not exist");
        require(purchased[msg.sender][modelId], "Model not purchased");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        Model storage model = models[modelId];
        model.totalRating += rating;
        model.ratingCount += 1;

        emit ModelRated(modelId, rating, msg.sender);
    }

    // Функция для получения деталей модели
    function getModelDetails(uint256 modelId)
        public
        view
        returns (
            string memory name,
            string memory description,
            uint256 price,
            address creator,
            uint16 totalRating,
            uint8 avgRating
        )
    {
        require(modelId < models.length, "Model does not exist");
        Model storage model = models[modelId];
        uint8 averageRating = model.ratingCount == 0 ? 0 : uint8(model.totalRating / model.ratingCount);

        return (
            model.name,
            model.description,
            model.price,
            model.creator,
            model.totalRating,
            averageRating
        );
    }

    // Функция для получения общего количества моделей
    function getModelCount() public view returns (uint256) {
        return models.length;
    }

    // Функция для вывода средств создателем модели
    function withdrawFunds(uint256 modelId) public {
    require(modelId < models.length, "Model does not exist");
    Model storage model = models[modelId];
    require(model.creator == msg.sender, "Only the creator can withdraw funds");

    uint256 amount = address(this).balance; // Получаем баланс контракта
    require(amount > 0, "No funds available for withdrawal");

    // Сбрасываем баланс контракта
    (bool success, ) = model.creator.call{value: amount}(""); 
    require(success, "Transfer failed");

    emit FundsWithdrawn(model.creator, amount);
}
}
