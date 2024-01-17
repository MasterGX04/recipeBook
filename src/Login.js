import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    
    const handleLogin = async () => {
        setLoggingIn(true);
        axios.post('http://localhost/login.php', {
            username: username,
            password: password,
        }).then((response) => {
            console.log(response.data);
            if (response.data.success) {
                onLogin();
            } else {
                // Display separate error messages for username and password
                if (response.data.errors) {
                    setUserError(response.data.errors.username);
                    setPasswordError(response.data.errors.password);
                } else {
                    setUserError('Invalid username');
                    setPasswordError('Invalid password');
                }
            }
        }).catch((error) => {
            console.error('Error during login', error);
            setUserError('An error occurred');
            setPasswordError('An error occurred');
        }).finally(() => {
            setLoggingIn(false);
        });
    };

    const redirectToSignup = () => {
        navigate('/signup');
    }
    return (
        <div>
            <h2>Login Page</h2>
            <label>Username: </label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            {userError && <p style={{ color: 'red' }}>{userError}</p>}
            <br />
            <label>Password: </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            <br />
            <button type="button" onClick={handleLogin} disabled={loggingIn}>
                {loggingIn ? 'Logging In...' : 'Login'}
            </button>
            <p>Don't have an account? <button onClick={redirectToSignup}>Sign Up</button></p>
        </div>
    );
};

export default Login;