<?php
// Enable CORS (Cross-Origin Resource Sharing)
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit;
}

include 'db_connection.php';    
// Check if it's a POST request
$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $searchTerm = $data->searchTerm;

    // Perform a search query on your database
    $sql = "SELECT * FROM recipes 
            WHERE title LIKE '%$searchTerm%'
            OR ingredients LIKE '%$searchTerm%'
            OR instructions LIKE '%$searchTerm%'";

    $result = $conn->query($sql);

    if ($result) {
        $searchResults = [];

        while ($row = $result->fetch_assoc()) {
            $searchResults[] = $row;
        }
        echo json_encode([$searchResults]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error executing database query: " . $conn->error]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Missing search term"]);
}

// Close the database connection
$conn->close();
?>