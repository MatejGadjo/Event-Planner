import React, { useState, useEffect } from 'react';
import { FaPhone, FaTimes } from 'react-icons/fa';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import './css/UserGrid.css';

const UserGrid = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userResources, setUserResources] = useState([]);
    const [loadingResources, setLoadingResources] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
                setFilteredUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = users.filter(user => 
            user.firstName?.toLowerCase().includes(query) ||
            user.lastName?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const handleDetailsClick = async (user) => {
        setSelectedUser(user);
        setLoadingResources(true);
        try {
            const resourcesQuery = query(
                collection(db, "resources"),
                where("userId", "==", user.id)
            );
            const resourcesSnapshot = await getDocs(resourcesQuery);
            const resourcesList = resourcesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUserResources(resourcesList);
        } catch (error) {
            console.error("Error fetching user resources:", error);
        } finally {
            setLoadingResources(false);
        }
    };

    if (loading) {
        return <div className="cards-user-grid">Вчитување...</div>;
    }

    return (
        <div className="user-grid-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Пребарај корисници..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>
            {filteredUsers.length === 0 ? (
                <div className="cards-user-grid empty-state">
                    <p>Нема пронајдено корисници</p>
                    <p className="empty-state-subtitle">
                        Нема корисници кои одговараат на пребарувањето
                    </p>
                </div>
            ) : (
                <div className="cards-user-grid">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="user-card">
                            <div className="user-info">
                                <h3 className="user-name">{user.firstName} {user.lastName}</h3>
                                <p className="user-email">{user.email}</p>
                                {user.phone && (
                                    <div className="user-contact">
                                        <FaPhone />
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                            </div>
                            <button 
                                className="details-button"
                                onClick={() => handleDetailsClick(user)}
                            >
                                Детали
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            className="close-button"
                            onClick={() => setSelectedUser(null)}
                        >
                            <FaTimes />
                        </button>
                        <div className="user-details">
                            <h2>{selectedUser.firstName} {selectedUser.lastName}</h2>
                            <div className="user-info-details">
                                <p><strong>Име:</strong> {selectedUser.firstName}</p>
                                <p><strong>Презиме:</strong> {selectedUser.lastName}</p>
                                <p><strong>Е-пошта:</strong> {selectedUser.email}</p>
                                {selectedUser.phone && (
                                    <p><strong>Телефон:</strong> {selectedUser.phone}</p>
                                )}
                            </div>
                            <h3>Ресурси</h3>
                            {loadingResources ? (
                                <p>Вчитување на ресурси...</p>
                            ) : userResources.length > 0 ? (
                                <div className="resources-grid">
                                    {userResources.map((resource) => (
                                        <div key={resource.id} className="resource-card">
                                            <h4>{resource.name}</h4>
                                            <p><strong>Категорија:</strong> {resource.category}</p>
                                            <p><strong>Цена:</strong> {resource.price}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Нема ресурси</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserGrid;
