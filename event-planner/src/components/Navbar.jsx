import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logout from "../pages/Logout.jsx";
import NotificationBell from './NotificationBell';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import './css/Navbar.css';

const Navbar = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/notifications/${user.uid}`);
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

    return (
        <nav className="navbar">
            <div><Link to='/' className="logo">E·QUIP<sup> мк</sup></Link></div>
            <div className="navbar-buttons">
                {user ? (
                    <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                        <strong>Здраво, <Link to="/profile">{userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}</Link></strong>
                        <NotificationBell user={user} />
                        <Logout user={user} />
                    </div>
                ) : (
                    <Logout user={user} />
                )}
            </div>
        </nav>
    );
};

export default Navbar;
