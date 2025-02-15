let userAccount = null;
let web3;
let financeTracker;

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0) {
                userAccount = accounts[0];
                console.log("Кошелек уже подключен:", userAccount);
                document.getElementById("wallet").innerText = "Кошелек: " + userAccount;
            }
        } catch (error) {
            console.error("Ошибка получения аккаунта:", error);
        }
    } else {
        alert("Установите MetaMask!");
    }

    // Инициализация контракта
    const contractAddress = "0x..."; // Укажи адрес контракта
    const contractABI = [/* Твой ABI сюда */];

    financeTracker = new web3.eth.Contract(contractABI, contractAddress);
}

async function connectMetaMask() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            userAccount = accounts[0];
            console.log("Подключён аккаунт:", userAccount);
            document.getElementById("wallet").innerText = "Кошелек: " + userAccount;
        } catch (error) {
            console.error("Ошибка подключения:", error);
        }
    } else {
        alert("Установите MetaMask!");
    }
}

const addTransaction = async () => {
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;

    if (!userAccount) {
        alert("Сначала подключите MetaMask!");
        return;
    }

    try {
        await financeTracker.methods.addTransaction(description, amount).send({ from: userAccount });
        getTransactions();
    } catch (error) {
        console.error("Ошибка транзакции:", error);
    }
};

const getTransactions = async () => {
    if (!financeTracker) {
        console.error("Контракт не инициализирован!");
        return;
    }

    try {
        const transactions = await financeTracker.methods.getTransactions().call();
        const list = document.getElementById("transactions");
        list.innerHTML = "";
        
        transactions.forEach(tx => {
            const item = document.createElement("li");
            item.innerText = `${tx.description}: ${tx.amount} ETH`;
            list.appendChild(item);
        });
    } catch (error) {
        console.error("Ошибка получения транзакций:", error);
    }
};

document.getElementById("show-transactions").addEventListener("click", function() {
    let transactionsList = document.getElementById("transactions");
    transactionsList.style.display = transactionsList.style.display === "none" ? "block" : "none";
});

window.addEventListener("load", initWeb3);
