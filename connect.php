<?php
session_start();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['address'])) {
        $_SESSION['wallet_address'] = $data['address'];
        echo json_encode(['status' => 'success', 'address' => $data['address']]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Address not provided.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
