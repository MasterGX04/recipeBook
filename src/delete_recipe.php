<?php
include('db_connection.php');

$data = json_decode(file_get_contents("php://input"));
$id = $data->id;

$sql = "DELETE FROM recipes WHERE id = '$id'";

if ($conn->query($sql) == TRUE) {
    echo json_encode(["message" => "Recipe deleted successfully"]);
} else {
    echo json_encode(["Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>