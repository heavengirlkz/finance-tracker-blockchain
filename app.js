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

// Проверяем, есть ли MetaMask
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

window.addEventListener("load", initWeb3);
