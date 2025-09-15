<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Web3 Wallet Connection</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>PHP Web3 Wallet Connection</h1>
        <p>Connect your Ethereum/BSC wallet to this application.</p>
        <div id="wallet-info">
            <?php if (isset($_SESSION['wallet_address'])): ?>
                <button id="connect-wallet-btn" class="btn hidden">Connect Wallet</button>
                <div id="account-details">
                    <p><strong>Connected Account:</strong> <span id="account-address"><?php echo htmlspecialchars($_SESSION['wallet_address']); ?></span></p>
                    <p><strong>Network:</strong> <span id="network-name"></span></p>
                    <button id="disconnect-wallet-btn" class="btn btn-danger">Disconnect</button>
                </div>
            <?php else: ?>
                <button id="connect-wallet-btn" class="btn">Connect Wallet</button>
                <div id="account-details" class="hidden">
                    <p><strong>Connected Account:</strong> <span id="account-address"></span></p>
                    <p><strong>Network:</strong> <span id="network-name"></span></p>
                    <button id="disconnect-wallet-btn" class="btn btn-danger">Disconnect</button>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
