<?php
session_start();

header('Content-Type: application/json');

if (isset($_SESSION['wallet_address'])) {
    echo json_encode(['status' => 'connected', 'address' => $_SESSION['wallet_address']]);
} else {
    echo json_encode(['status' => 'disconnected']);
}
?>
