import React from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Tabs from "../components/Tabs.jsx";
import UserGrid from "../components/UserGrid.jsx";

import "./css/UserList.css";
import "../App.css";

const UserList = ({ user }) => {
    return (
        <div className="app-container">
            <Navbar user={user}></Navbar>
            <div className={"main-container"}>
                <Sidebar></Sidebar>
                <UserGrid></UserGrid>
            </div>
        </div>
    );
}

export default UserList;