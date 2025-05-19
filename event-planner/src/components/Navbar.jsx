import React, { useState, useEffect } from 'react';
import Logout from "../pages/Logout.jsx";

//promeneta e user promenlivata so currentUser za testiranje na notifications
const Navbar = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

    const testUser = { uid: 1, email: "test@example.com" }; // Mock user for testing

    const currentUser = user || testUser; // Use mock user if no user is provided

    useEffect(() => {
        if (currentUser) {
            fetchNotifications();
        }
    }, [currentUser]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/notifications/${currentUser.uid}`);
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.is_read).length);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await fetch(`http://localhost:3000/api/notifications/${notificationId}/read`, {
                method: "PUT",
            });
            fetchNotifications(); // Refresh after marking as read
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    function userFromEmail(email) {
        const clearUsername = email.split('@')[0]
        return clearUsername;
    }

    return (
        <nav className="navbar">
            <div><a href='/' className="logo">E·QUIP<sup> мк</sup></a></div>
            <div className="search-bar">
                <input type="text" placeholder="Пребарувај настани" className="search-input" />
                <button className="search-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-search" viewBox="0 0 16 16">
                        <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                </button>
            </div>

            <div className={"navbar-buttons"}>

                {currentUser ? (
                    <div style={{display: "flex", alignItems: "center"}}>
                        <strong>Здраво, <a href="/profile">{userFromEmail(currentUser.email)} </a> </strong>
                        <Logout/>
                    </div>
                ) : (
                    <a href="/login" className={"navbar-button"}>
                        НАЈАВИ СЕ</a>
                )}


                <div className={"notification-button"} onClick={() => setShowDropdown(!showDropdown)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-bell" viewBox="0 0 16 16">
                        <path
                            d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
                    </svg>
                    {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
                </div>

                {showDropdown && (
                    <div className="notification-dropdown">
                        {notifications.length === 0 ? (
                            <p>No notifications</p>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.is_read ? "read" : "unread"}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    {notification.message}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
