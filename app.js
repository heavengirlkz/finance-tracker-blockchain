const addTransaction = async () => {
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const accounts = await web3.eth.getAccounts();
    
    await financeTracker.methods.addTransaction(description, amount).send({ from: accounts[0] });

    getTransactions();
};

const getTransactions = async () => {
    const transactions = await financeTracker.methods.getTransactions().call();
    const list = document.getElementById("transactions");
    list.innerHTML = "";
    
    transactions.forEach(tx => {
        const item = document.createElement("li");
        item.innerText = `${tx.description}: ${tx.amount} ETH`;
        list.appendChild(item);
    });
};

document.getElementById("show-transactions").addEventListener("click", function() {
    let transactionsList = document.getElementById("transactions");
    transactionsList.style.display = transactionsList.style.display === "none" ? "block" : "none";
});

let userAccount = null;

let userAccount = null;

// 1️⃣ Функция для подключения MetaMask
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

// 2️⃣ Функция для запроса последних транзакций
async function getTransactions() {
    if (!userAccount) {
        alert("Сначала подключите MetaMask!");
        return;
    }

    const provider = new Web3(window.ethereum);
    const transactionsList = document.getElementById("transactions");
    transactionsList.innerHTML = "Загрузка транзакций...";

    try {
        const blockNumber = await provider.eth.getBlockNumber();
        let transactions = [];

        for (let i = blockNumber; i > blockNumber - 10; i--) {  // Проверяем последние 10 блоков
            const block = await provider.eth.getBlock(i, true);
            if (block && block.transactions) {
                transactions.push(...block.transactions.filter(tx => tx.from.toLowerCase() === userAccount.toLowerCase()));
            }
        }

        transactionsList.innerHTML = "";
        if (transactions.length === 0) {
            transactionsList.innerHTML = "<li>Нет транзакций</li>";
        } else {
            transactions.forEach(tx => {
                let li = document.createElement("li");
                li.innerHTML = `Hash: <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">${tx.hash.slice(0, 10)}...</a> | Сумма: ${provider.utils.fromWei(tx.value, "ether")} ETH`;
                transactionsList.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Ошибка загрузки транзакций:", error);
    }
}

window.addEventListener("load", initWeb3);
