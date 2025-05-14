<?php
header('Content-Type: application/json');

// Database config
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "clinic_appointment";
$port = "3307";

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$passwordInput = $data['password'] ?? '';

if (!$email || !$passwordInput) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM Users WHERE Email = :email LIMIT 1");
$stmt->bindParam(':email', $email);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($passwordInput, $user['Password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    exit;
}

// Check if admin (assumed by email domain)
$isAdmin = strpos($user['Email'], '@wecare.com') !== false;

echo json_encode([
    'success' => true,
    'isAdmin' => $isAdmin,
    'user' => [
        'email' => $user['Email'],
        'name' => $user['Name'] ?? $user['Email']
    ]
]);
?>
