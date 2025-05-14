<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $port = "3307";
    $dbname = "clinic_appointment";

    try {
        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname, $port);
        // Check connection
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }

        // Validate inputs
        $fullName = trim($conn->real_escape_string($_POST['fullName'] ?? ''));
        $email = trim($conn->real_escape_string($_POST['email'] ?? ''));
        $contactnumber = trim($conn->real_escape_string($_POST['phone'] ?? ''));
        $rawPassword = $_POST['password'] ?? '';
        $adminPin = $_POST['adminPin'] ?? '';

        if (empty($fullName) || empty($email) || empty($contactnumber) || empty($rawPassword)) {
            throw new Exception("All fields are required!");
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format!");
        }

        // Check if email domain is @wecare.com and validate admin pin
        if (strpos($email, '@wecare.com') !== false) {
            if ($adminPin !== '223456') { // Replace '123456' with your actual admin pin
                throw new Exception("Invalid admin pin!");
            }
        }

        // Check if email exists (using transaction)
        $conn->begin_transaction();
        $checkEmail = "SELECT Email FROM users WHERE Email = ? FOR UPDATE";
        $stmt = $conn->prepare($checkEmail);
        $stmt->bind_param("s", $email);

        if (!$stmt->execute()) {
            throw new Exception("Error checking email: " . $stmt->error);
        }

        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $conn->rollback();
            throw new Exception("Email already exists.");
        }

        // Hash password
        $hashedPassword = password_hash($rawPassword, PASSWORD_DEFAULT);

        // Insert new user
        $sql = "INSERT INTO users (FullName, Email, ContactNumber, Password) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $fullName, $email, $contactnumber, $hashedPassword);

        if (!$stmt->execute()) {
            $conn->rollback();
            throw new Exception("Registration failed: " . $stmt->error);
        }

        $conn->commit();
        echo "Registration successful!";

    } catch (Exception $e) {
        if (isset($conn)) {
            $conn->rollback();
        }
        http_response_code(400);
        die($e->getMessage());
    } finally {
        if (isset($conn)) {
            $conn->close();
        }
    }
} else {
    http_response_code(405);
    die("Method not allowed");
}
?>
