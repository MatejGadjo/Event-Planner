import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import "./css/Profile.css";
import "../App.css";
import ItemCarousel from "../components/ItemCarousel.jsx";
import EventCarousel from "../components/EventCarousel";
import UserGrid from "../components/UserGrid.jsx";

const Profile = ({ user }) => {
    const [userData, setUserData] = useState(null);
    const [loading,setLoading] = useState(true);

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
            <Navbar user={user}></Navbar>
            <div className={"main-container"}>
                <div>
                    <Sidebar></Sidebar>
                </div>
                <div className="whole-container">

                    <div className="profile-info-box">
                        <div className="profile-greetings">
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                <div>
                                    {userData ? (
                                            <div>
                                                <h2>Здраво, {userData.firstName} {userData.lastName}</h2>
                                            </div>
                                    ) : (
                                        <div>

                                        <h2>Здраво, Anonymous User</h2>
                                        </div>
                                    )}

                                </div>
                            )}
                            <button className="profile-create-button">Огласи настан</button>

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
                            </div>
                        </div>
                    </div>
                    <div className="profile-events-box">
                        <h3>Резервирани ресурси</h3>
                        <ul>
                            {Array.from({ length: 25 }).map((_, index) => (
                                <li>Име на настан {index+1}</li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Profile;