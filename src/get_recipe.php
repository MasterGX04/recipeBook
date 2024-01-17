<?php
include 'db_connection.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $recipe = json_decode(file_get_contents("php://input"));
    $recipe_id = $recipe->recipeId;

    $sql = "SELECT * FROM recipes WHERE id = $recipe_id";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $recipe_details = $result->fetch_assoc();
        echo json_encode($recipe_details);
    } else {
        echo json_encode(["error" => "Recipe not found"]);
    }

    $conn->close();
}
?>