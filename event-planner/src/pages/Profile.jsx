import React from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import "./css/Profile.css";
import "../App.css";
import ItemCarousel from "../components/ItemCarousel.jsx";
import EventCarousel from "../components/EventCarousel";

const Profile = () => {
    return (
        <div className="app-container">
            <Navbar></Navbar>
            <div className={"main-container"}>
                <div>
                    <Sidebar></Sidebar>
                </div>
                <div className="whole-container">

                    <div className="profile-info-box">
                        <div className="profile-greetings">
                            <div>
                                <h2>Здраво, User!</h2>
                                <h3>Спремни за забава? Организирај го твојот следен настан!</h3>
                            </div>
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