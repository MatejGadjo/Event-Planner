import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import "./css/Profile.css";
import "../App.css";
import ItemCarousel from "../components/ItemCarousel.jsx";
import EventCarousel from "../components/EventCarousel";
import AddResourcePopup from "../components/AddResourcePopup";
import Footer from "../components/Footer.jsx";

const Profile = ({ user }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddResource, setShowAddResource] = useState(false);
    const [reservedResources, setReservedResources] = useState([]);
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchReservedResources = async () => {
            if (!user) return;

            try {
                // Query resources that are reserved by this user
                const resourcesQuery = query(
                    collection(db, "resources"),
                    where("reservedBy", "==", user.uid)
                );

                const resourcesSnapshot = await getDocs(resourcesQuery);
                const resources = [];

                for (const resourceDoc of resourcesSnapshot.docs) {
                    const resourceData = resourceDoc.data();
                    
                    // Get the event details for this resource
                    if (resourceData.reservedFor) {
                        const eventDoc = await getDoc(doc(db, "events", resourceData.reservedFor));
                        if (eventDoc.exists()) {
                            resources.push({
                                id: resourceDoc.id,
                                name: resourceData.name,
                                eventName: eventDoc.data().title,
                                price: resourceData.price
                            });
                        }
                    }
                }

                setReservedResources(resources);
            } catch (error) {
                console.error("Error fetching reserved resources:", error);
            }
        };

        fetchReservedResources();
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
                                <button 
                                    className="profile-create-button"
                                    onClick={() => navigate('/createevent')}
                                >
                                    Креирај настан
                                </button>
                            </div>

                            <div className="profile-items-box">
                                <h3>Твои настани</h3>
                                <div className="profile-events-section">
                                    <EventCarousel user={user} />
                                </div>
                                
                                <h3>Менаџирај ги своите ресурси</h3>
                                <div className="profile-items-section">
                                    <button 
                                        className="profile-add-button" 
                                        onClick={() => setShowAddResource(true)}
                                        aria-label="Add new resource"
                                    >
                                        +
                                    </button>
                                    <ItemCarousel user={user} />
                                </div>
                            </div>
                        </div>

                        <div className="profile-events-box">
                            <h3>Резервирани ресурси</h3>
                            {reservedResources.length > 0 ? (
                                <ul className="reserved-resources-list">
                                    {reservedResources.map((resource) => (
                                        <li key={resource.id} className="reserved-resource-item">
                                            <span className="resource-name">{resource.name}</span>
                                            <span className="event-name">за {resource.eventName}</span>
                                            <span className="resource-price">{resource.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-resources">Нема резервирани ресурси</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <AddResourcePopup 
                isOpen={showAddResource}
                onClose={() => setShowAddResource(false)}
                user={user}
            />
        </div>
    );
}

export default Profile;