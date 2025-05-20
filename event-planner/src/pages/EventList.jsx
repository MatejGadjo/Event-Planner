import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EventGrid from "../components/EventGrid";
import Footer from "../components/Footer.jsx";

import "./css/EventList.css";
import "../App.css";

const EventList = ({ user }) => {
    return (
        <div className="app-container">
            <Navbar user={user} />
            <div className="main-container">
                <Sidebar />
                <div className="profile-main-card">
                    <div className="whole-container">
                        <EventGrid />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EventList;