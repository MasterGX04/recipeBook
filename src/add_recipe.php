<?php
include 'db_connection.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $title = $data->title;
    $ingredients = $data->ingredients;
    $instructions = $data->instructions;

    $sql = "INSERT INTO recipes (title, ingredients, instructions) VALUES ('$title', '$ingredients', '$instructions')";
    if ($conn->query($sql) == TRUE) {
        echo json_encode(["message" => "Recipe added successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $sql, "<br>" . $conn->error]);
    }
} else {
    echo json_encode(["error"=> "Boohoo"]);
}

$conn->close();
?>