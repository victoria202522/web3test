document.addEventListener('DOMContentLoaded', () => {
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');
    const accountDetails = document.getElementById('account-details');
    const accountAddress = document.getElementById('account-address');
    const networkName = document.getElementById('network-name');

    let provider;
    let signer;

    const updateNetworkInfo = async () => {
        if (provider) {
            const network = await provider.getNetwork();
            networkName.textContent = network.name;
        }
    };

    const updateUI = (address) => {
        accountAddress.textContent = address;
        connectWalletBtn.classList.add('hidden');
        accountDetails.classList.remove('hidden');
        updateNetworkInfo();
    };

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send('eth_requestAccounts', []);

                if (accounts.length > 0) {
                    const address = accounts[0];
                    const response = await fetch('connect.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ address: address }),
                    });

                    const data = await response.json();
                    if (data.status === 'success') {
                        updateUI(data.address);
                    }
                }

                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        connectWallet();
                    } else {
                        disconnectWallet();
                    }
                });

                window.ethereum.on('chainChanged', () => {
                    updateNetworkInfo();
                });

            } catch (error) {
                console.error('Error connecting to wallet:', error);
                alert('Failed to connect wallet. Please try again.');
            }
        } else {
            alert('Please install a web3 wallet like MetaMask.');
        }
    };

    const disconnectWallet = async () => {
        const response = await fetch('disconnect.php');
        const data = await response.json();

        if (data.status === 'success') {
            provider = null;
            signer = null;
            accountAddress.textContent = '';
            networkName.textContent = '';
            connectWalletBtn.classList.remove('hidden');
            accountDetails.classList.add('hidden');
        }
    };

    const checkStatus = async () => {
        const response = await fetch('status.php');
        const data = await response.json();

        if (data.status === 'connected' && typeof window.ethereum !== 'undefined') {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            updateUI(data.address);
        }
    };

    connectWalletBtn.addEventListener('click', connectWallet);
    disconnectWalletBtn.addEventListener('click', disconnectWallet);

    checkStatus();
});
