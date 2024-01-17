<?php
header('Content-Type: application/json');

// Retrieve the raw POST data
$data = file_get_contents("php://input");

// Decode the JSON data
$userData = json_decode($data);


if ($userData === null) {
    // JSON decoding failed
    echo json_encode(["error" => "Invalid JSON data: " . json_last_error_msg()]);
    exit;
}

// Extract data from the decoded JSON
$number = $userData->number;
$conn = createDatabaseConnection();

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}
$query = "SELECT name, number, address, building, flatNumber FROM users WHERE number = $number";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Now, fetch menuType from the menu table
    $menuTypeQuery = "SELECT menuType FROM menu";
    $menuTypeResult = $conn->query($menuTypeQuery);

    if ($menuTypeResult->num_rows > 0) {
        $menuTypeRow = $menuTypeResult->fetch_assoc();
        $row['menuType'] = $menuTypeRow['menuType'];
    } else {
        $row['menuType'] = "No menuType found";
    }
    
    echo json_encode(['data' => $row]);
} else {
    echo json_encode("User Not Found");
}
function createDatabaseConnection() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "hometiffinservice";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }

    return $conn;
}
?>

