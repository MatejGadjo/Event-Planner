import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import "./css/Profile.css";
import "../App.css";
import ItemCarousel from "../components/ItemCarousel.jsx";
import EventCarousel from "../components/EventCarousel";

const Profile = ({ user }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.log("No such document!");
                }
                setLoading(false);
            };

            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [user]);

    return (
        <div className="app-container">
            <Navbar user={user} />
            <div className="main-container">
                <Sidebar />
                <div className="profile-main-card">
                    <div className="whole-container">
                        <div className="profile-info-box">
                            <div className="profile-greetings">
                                {loading ? (
                                    <div className="loading-skeleton">Loading...</div>
                                ) : (
                                    <div>
                                        {userData ? (
                                            <h2>Здраво, {userData.firstName} {userData.lastName}</h2>
                                        ) : (
                                            <h2>Здраво, Anonymous User</h2>
                                        )}
                                    </div>
                                )}
                                <button className="profile-create-button">
                                    Огласи на настан
                                </button>
                            </div>

                            <div className="profile-items-box">
                                <h3>Твои настани</h3>
                                <div className="profile-events-section">
                                    <EventCarousel />
                                </div>
                                
                                <h3>Менаџирај ги своите ресурси</h3>
                                <div className="profile-items-section">
                                    <button className="profile-add-button" aria-label="Add new resource">
                                        +
                                    </button>
                                    <ItemCarousel />
                                </div>
<<<<<<< Updated upstream
                            )}
                            <a href="/createevent" className="profile-create-button-link"><button className="profile-create-button">Огласи настан</button></a>

                        </div>

                        <div className="profile-items-box">
                            <h3>Твои настани</h3>
                            <div className="profile-events-section">
                                <EventCarousel></EventCarousel>
                            </div>
                            <h3>Менаџирај ги своите ресурси</h3>
                            <div className="profile-items-section">
                                <div className="profile-add-button">+</div>
                                <ItemCarousel></ItemCarousel>
=======
>>>>>>> Stashed changes
                            </div>
                        </div>

                        <div className="profile-events-box">
                            <h3>Резервирани ресурси</h3>
                            <ul>
                                {Array.from({ length: 25 }).map((_, index) => (
                                    <li key={index}>
                                        Име на настан {index + 1}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;