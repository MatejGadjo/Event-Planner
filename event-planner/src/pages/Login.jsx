import React, {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { useNavigate } from "react-router-dom";
import "./css/Login.css"


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {

                navigate("/profile");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Најава</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-input">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-input">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <small className="black-text"> Немаш корисничка сметка? Регистрирај се <a href="/register">тука</a></small>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="submit-btn">Најави се</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
