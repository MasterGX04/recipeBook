<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recipe_book";

$conn = new mysqli($servername, $username, $password, $dbname);

//Checks connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>