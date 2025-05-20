import React, {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { useNavigate } from "react-router-dom";
import "./css/Login.css"


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/profile");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="logo-home">E·QUIP<sup> мк</sup></div>
                <h2>Најава</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-input">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-input">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <small className="black-text"> Немаш корисничка сметка? Регистрирај се <a href="/register">тука</a></small>
                    {error && <p className="error-message">{error}</p>}
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Најавување...' : 'Најави се'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
