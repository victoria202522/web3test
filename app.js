document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const Web3Modal = window.Web3Modal.default;
    const WalletConnectProvider = window.WalletConnectProvider.default;
    const ethers = window.ethers;

    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');
    const accountDetails = document.getElementById('account-details');
    const accountAddress = document.getElementById('account-address');
    const networkName = document.getElementById('network-name');

    let web3Modal;
    let provider;
    let signer;

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                // You will need to get your own Project ID from WalletConnect Cloud
                // https://cloud.walletconnect.com
                // This is a public test ID
                infuraId: "27e484d2943b4384b8575a6c88689531",
            }
        }
    };

    web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask or other injected providers
    });

    const updateUI = async (address) => {
        accountAddress.textContent = address;
        connectWalletBtn.classList.add('hidden');
        accountDetails.classList.remove('hidden');
        if (provider) {
            const network = await provider.getNetwork();
            networkName.textContent = network.name;
        }
    };

    const fetchAccountData = async () => {
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        signer = ethersProvider.getSigner();
        const address = await signer.getAddress();

        updateUI(address);

        // Send address to backend
        await fetch('connect.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: address }),
        });
    };

    const refreshAccountData = async () => {
        await fetchAccountData();
    };

    const connectWallet = async () => {
        try {
            provider = await web3Modal.connect();
        } catch(e) {
            console.log("Could not get a wallet connection", e);
            return;
        }

        provider.on("accountsChanged", (accounts) => {
            fetchAccountData();
        });

        provider.on("chainChanged", (chainId) => {
            fetchAccountData();
        });

        provider.on("disconnect", (error) => {
            console.log("disconnect", error);
            disconnectWallet();
        });

        await refreshAccountData();
    };

    const disconnectWallet = async () => {
        if(provider && provider.close) {
            await provider.close();
        }
        await web3Modal.clearCachedProvider();
        provider = null;
        signer = null;

        await fetch('disconnect.php');

        accountAddress.textContent = '';
        networkName.textContent = '';
        connectWalletBtn.classList.remove('hidden');
        accountDetails.classList.add('hidden');
    };

    // Check if the user is already connected
    const checkInitialConnection = async () => {
        if (web3Modal.cachedProvider) {
            try {
                await connectWallet();
            } catch (e) {
                console.log("Could not connect to cached provider", e);
                // If connection to cached provider fails, clear it
                await web3Modal.clearCachedProvider();
                return;
            }
        }
    };

    connectWalletBtn.addEventListener('click', connectWallet);
    disconnectWalletBtn.addEventListener('click', disconnectWallet);

    checkInitialConnection();
});
