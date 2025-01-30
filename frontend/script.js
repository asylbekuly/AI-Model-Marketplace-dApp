console.log("Checking if ethers.js is loaded...");
console.log("Ethers.js type:", typeof ethers);

console.log("Checking if MetaMask is available...");
console.log("Ethereum object:", window.ethereum);

const contractAddress = "0x514C0430EC2C52A0d1a92678671A5e5B7863c444"; // Вставьте адрес контракта 
const abi =[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "ModelListed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      }
    ],
    "name": "ModelPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "rating",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "rater",
        "type": "address"
      }
    ],
    "name": "ModelRated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getModelCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      }
    ],
    "name": "getModelDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint16",
        "name": "totalRating",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "avgRating",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "listModel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "models",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "ratingCount",
        "type": "uint8"
      },
      {
        "internalType": "uint16",
        "name": "totalRating",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      }
    ],
    "name": "purchaseModel",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "purchased",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "rating",
        "type": "uint8"
      }
    ],
    "name": "rateModel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      }
    ],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
let contract, provider, signer;

// Инициализация провайдера
window.addEventListener("load", async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      console.log("MetaMask detected.");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);

      console.log("Connected to Ethereum");
      loadModels();
    } catch (err) {
      if (err.code === 4001) {
        console.error("User denied account access");
        alert("Please allow MetaMask to connect to this DApp.");
      } else {
        console.error("Error connecting to MetaMask:", err);
      }
    }
  } else {
    alert("MetaMask is not installed. Please install it to use this DApp.");
  }
});

// Функция для загрузки моделей
async function loadModels() {
  console.log("Loading models...");
  const modelsList = document.getElementById("models-list");
  modelsList.innerHTML = ""; // Очистка списка моделей

  try {
    const totalModels = await contract.getModelCount();
    console.log("Total models found:", totalModels);

    // Если моделей нет, выводим сообщение
    if (totalModels === 0) {
      modelsList.innerHTML = "<p>No models available at the moment.</p>";
      return;
    }
    for (let i = 0; i < totalModels; i++) {
      const model = await contract.getModelDetails(i);
      console.log(`Model ${i}:`, model);
    
      const [name, description, price, creator, totalRating, avgRating] = model;
    
      const modelElement = document.createElement("div");
      modelElement.className = "model";
      modelElement.innerHTML = `
        <h3>${name}</h3>
        <p>${description}</p>
        <p>Price: ${ethers.utils.formatEther(price)} ETH</p>
        <p>Creator: ${creator}</p>
        <p>Total Rating: ${totalRating}</p>
        <p>Average Rating: ${avgRating}</p>
        <button onclick="buyModel(${i})">Buy</button>
        <button onclick="rateModel(${i})">Rate</button>
        <button onclick="viewModelDetails(${i})">View Details</button>
        <button onclick="withdrawFunds(${i})">Withdraw Funds for Model ${i}</button>
      `;
      modelsList.appendChild(modelElement);
    }
    

    console.log("Models loaded successfully.");
  } catch (err) {
    console.error("Error loading models:", err);
  }
}

// Функция для просмотра деталей модели
async function viewModelDetails(modelId) {
  try {
    const modelDetails = await contract.getModelDetails(modelId);
    const [name, description, price, creator, totalRating, avgRating] = modelDetails;
    
    alert(`Model: ${name}\nDescription: ${description}\nPrice: ${ethers.utils.formatEther(price)} ETH\nCreator: ${creator}\nTotal Rating: ${totalRating}\nAverage Rating: ${avgRating}`);
  } catch (err) {
    console.error("Error fetching model details:", err);
    alert("Failed to fetch model details.");
  }
}

async function withdrawFunds(modelId) {
  try {
    console.log("Attempting to withdraw funds for modelId:", modelId);

    // Получаем баланс контракта перед выводом средств
    const contractBalanceBefore = await provider.getBalance(contract.address);
    console.log("Balance before withdrawal: ", ethers.utils.formatEther(contractBalanceBefore));

    // Выполняем вывод средств
    const tx = await contract.withdrawFunds(modelId, { gasLimit: 500000 });
    console.log("Transaction sent, waiting for confirmation...");
    await tx.wait(); // Ожидаем завершения транзакции
    console.log("Funds withdrawn successfully.");

    // Получаем баланс контракта после вывода средств
    const contractBalanceAfter = await provider.getBalance(contract.address);
    console.log("Balance after withdrawal: ", ethers.utils.formatEther(contractBalanceAfter));

    alert("Funds have been withdrawn successfully");
  } catch (err) {
    console.error("Withdrawal error:", err);
    alert("Failed to withdraw funds.");
  }
}



// Обработчик формы добавления модели
document.getElementById("model-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("model-name").value;
  const description = document.getElementById("model-description").value;
  const price = document.getElementById("model-price").value;

  try {
    const tx = await contract.listModel(name, description, ethers.utils.parseEther(price));
    await tx.wait();
    alert("Model listed successfully!");
    loadModels();
  } catch (err) {
    console.error("Error listing model:", err);
    alert("Failed to list model.");
  }
});

// Функция для покупки модели
async function buyModel(modelId) {
    try {
      const model = await contract.getModelDetails(modelId);
      const price = model[2]; // Цена модели (в wei)
  
      console.log(`Buying model ${modelId} for ${ethers.utils.formatEther(price)} ETH`);
  
      const tx = await contract.purchaseModel(modelId, { value: price });
      await tx.wait();
  
      alert("Model purchased successfully!");
      loadModels(); // Обновляем список после покупки
    } catch (err) {
      console.error("Error purchasing model:", err);
      alert("Failed to purchase model.");
    }
  }
  

// Функция для оценки модели
async function rateModel(modelId) {
    const rating = prompt("Enter your rating (1 to 5):");
    if (!rating || rating < 1 || rating > 5) {
      alert("Invalid rating. Please enter a number between 1 and 5.");
      return;
    }
  
    try {
      console.log(`Rating model ${modelId} with rating ${rating}`);
  
      const tx = await contract.rateModel(modelId, parseInt(rating));
      await tx.wait();
  
      alert("Model rated successfully!");
      loadModels(); // Обновляем список после оценки
    } catch (err) {
      console.error("Error rating model:", err);
      alert("Failed to rate model.");
    }
  }
  
