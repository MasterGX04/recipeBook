<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'));
    $username = $data->username;
    $password = $data->password;

    $hashedPassword = getHashedPassword($conn, $username);

    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);

    if ($hashedPassword !== null && password_verify($password, $hashedPassword)) {
        echo json_encode(['success' => true]);
    } else {
        // Login failed
        $errors = [];
        $userExists = checkIfUserExists($conn, $username);

        if (!$userExists) {
            $errors['username'] = 'Invalid username';
        } else {
            $errors['password'] = 'Invalid password';
        }

        echo json_encode(['success' => false, 'errors' => $errors]);
    }
} else {
    echo json_encode(['authenticated' => false]);
}

$conn->close();
function getHashedPassword($conn, $username)
{
    $sql = "SELECT password FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['password'];
    }

    return null;
}

function checkIfUserExists($conn, $username)
{
    $sql = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($sql);
    return $result->num_rows > 0;
}
?>