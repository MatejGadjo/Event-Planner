import React, {useEffect, useState} from "react";
import {createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import {auth, db} from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from 'firebase/firestore';
import "./css/Register.css"

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {

                navigate("/profile");
            }
        });

        return () => unsubscribe();
    }, [navigate]);


    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db,"users",user.uid),{
               firstName: firstName,
                lastName : lastName,
               phone: phone,
               email: email,
            });
            console.log("User data saved in Firestore");
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2>Регистрација</h2>
                <form onSubmit={handleRegister}>
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
                    <div className="form-input">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="form-input">
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="form-input">
                        <input
                            type="text"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <small className="black-text"> Имате корисничка сметка? Најавете се <a
                        href="/login">тука</a></small>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="submit-btn">Регистрирај се</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
