// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint8 ratingCount;
        uint16 totalRating;
    }

    IERC20 public token; // Токен для оплаты

    Model[] public models;
    mapping(address => mapping(uint256 => bool)) public purchased;

    // События для логирования
    event ModelListed(uint256 modelId, string name, uint256 price, address creator);
    event ModelPurchased(uint256 modelId, address buyer);
    event ModelRated(uint256 modelId, uint8 rating, address rater);
    event FundsWithdrawn(address creator, uint256 amount);

    // Инициализация контракта с адресом токена
    constructor(address _token) {
        token = IERC20(_token); // Инициализация контракта токена
    }

    // Функция для добавления новой модели
    function listModel(string memory name, string memory description, uint256 price) public {
        require(price > 0, "Price must be greater than zero");
        models.push(Model(name, description, price, payable(msg.sender), 0, 0));
        emit ModelListed(models.length - 1, name, price, msg.sender);
    }

    // Функция для покупки модели с использованием токенов
   function purchaseModel(uint256 modelId) public {
    require(modelId < models.length, "Model does not exist");
    Model storage model = models[modelId];
    require(token.balanceOf(msg.sender) >= model.price, "Insufficient balance");
    require(!purchased[msg.sender][modelId], "Model already purchased");

    purchased[msg.sender][modelId] = true;

    // Переводим токены от покупателя к создателю модели
    token.transferFrom(msg.sender, model.creator, model.price);

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

    // Функция для вывода средств создателем модели
    function withdrawFunds() public {
        uint256 amount = token.balanceOf(address(this)); // Получаем баланс контракта
        require(amount > 0, "No funds available for withdrawal");

        // Переводим токены на кошелек создателя
        token.transfer(msg.sender, amount);

        emit FundsWithdrawn(msg.sender, amount);
    }
}
