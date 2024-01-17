<?php
include 'db_connection.php';

$recipe_data = json_decode(file_get_contents("php://input"));

$id = $recipe_data->id;
$title = $recipe_data->title;
$ingredients = $recipe_data->ingredients;
$instructions = $recipe_data->instructions;

$sql = "UPDATE recipes SET title = '$title', ingredients = '$ingredients', instructions = '$instructions' WHERE id = $id";

//Execute query
if ($conn->query($sql) == TRUE) {
    echo json_encode(["message" => "Recipe updated successfully"]);
} else {
    echo json_encode(["Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>