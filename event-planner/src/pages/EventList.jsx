import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs.jsx";
import EventGrid from "../components/EventGrid";

import "./css/EventList.css";
import "../App.css";

const EventList = ({ user }) => {
    return (
        <div className="app-container">
            <Navbar user={user}></Navbar>
            <div className={"main-container"}>
                <div>
                    <Tabs></Tabs>
                    <Sidebar></Sidebar>
                </div>

                <EventGrid></EventGrid>
            </div>
        </div>
    );
};

export default EventList;