import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [signingUp, setSigningUp] = useState(false);
    const [confirmation, setConfirmation] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSignUp = async () => {
        setSigningUp(true);

        //Perform validation
        if (!firstName || !lastName || !username || !password || !confirmPassword || !email) {
            setErrors({ message: 'All fields are required' });
            setSigningUp(false);
            return
        }

        if (password !== confirmPassword) {
            setErrors({ message: 'Password do not match' });
            setSigningUp(false);
            return;
        }

        //Check if username is availble
        const isUsernameAvailable = await checkUsernameAvailability(username);

        if (!isUsernameAvailable) {
            setErrors({ message: 'Username is already taken' });
            setSigningUp(false);
            return;
        }

        axios.post('http://localhost:80/signup.php', {
            firstName,
            lastName,
            username,
            password,
            email,
        })
            .then((response) => {
                console.log('Successful signup: ', response.data);
                //Redirect user to login page
                setConfirmation('Signup successful! Redirecting to login page...');
                // Optional: You can redirect after a delay
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // Redirect after 3 seconds
            })
            .catch((error) => {
                console.error('Signup failed:', error);
                setErrors({ message: 'Signup failed. Please try again.' });
            })
            .finally(() => {
                setSigningUp(false);
            })
    };

    const redirectToLogin = () => {
        navigate('/login');
    };

    //Returns true if username has already been used
    const checkUsernameAvailability = async (username) => {
        try {
            const response = await axios.post("http://localhost:80/check_username.php", {
                username,
            });
    
            if (response.data.success) {
                console.log("Username is available: ", response.data);
                return true;
            } else {
                console.log("Username is taken: ", response.data);
                return false;
            }
        } catch (error) {
            console.error('There was an error finding username', error);
            return false;
        }
    }

    return (
        <div>
            <h2>Sign Up</h2>
            <div>
                <label>First Name: </label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
                <label>Last Name: </label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
                <label>Create Username: </label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Email: </label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Create Password: </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label>Confirm Password: </label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            {confirmation && <p style={{ color: 'green' }}>{confirmation}</p>}
            <button type="button" onClick={handleSignUp} disabled={signingUp}>
                {signingUp ? 'Signing Up...' : 'Sign Up'}
            </button>
            {errors.message && <p style={{ color: 'red' }}>{errors.message}</p>}
            
            <p>Already have an account? <button onClick={redirectToLogin}>Login</button></p>
        </div>
    )
};

export default Signup;