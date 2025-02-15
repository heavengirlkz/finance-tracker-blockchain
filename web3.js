let web3;
let financeTracker;

const initWeb3 = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
        alert("Установите MetaMask!");
        return;
    }

    const response = await fetch("frontend/contracts/FinanceTracker.json");
    const contractData = await response.json();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = contractData.networks[networkId];

    financeTracker = new web3.eth.Contract(
        contractData.abi,
        deployedNetwork.address
    );

    getTransactions();
};
