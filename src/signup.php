<?php
    include("db_connection.php");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
    
        $username = $data->username;
        $password = $data->password;
        $first_name = $data->firstName;
        $last_name = $data->lastName;
        $email = $data->email;
    
        $sql = "INSERT INTO users (username, first_name, last_name, password, email) VALUES ('$username', '$first_name', '$last_name', '$password', '$email')";
        if ($conn->query($sql) == TRUE) {
            echo json_encode(["message" => "Recipe added successfully"]);
        } else {
            echo json_encode(["error" => "Error: " . $sql, "<br>" . $conn->error]);
        }
    } else {
        echo json_encode(["error"=> "Signup didn't work"]);
    }
?>