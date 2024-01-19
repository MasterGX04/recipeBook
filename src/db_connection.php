<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$servername = "bfjw8c8ucw4xmvmzib27-mysql.services.clever-cloud.com";
$username = "u5ekp2h6imgurc99";
$password = "in2V6bHDgEhNLD3gdwpu";
$dbname = "bfjw8c8ucw4xmvmzib27";

$conn = new mysqli($servername, $username, $password, $dbname);

//Checks connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>