import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, onSnapshot, getDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "./css/EventForm.css";
import "../App.css";

const EventCreate = ({ user }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        isPrivate: false,
        date: '',
        startTime: '00:00',
        endTime: '23:59',
        location: '',
        description: '',
        resources: []
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableResources, setAvailableResources] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResource, setSelectedResource] = useState(null);
    const [resourceOwners, setResourceOwners] = useState({});

    useEffect(() => {
        if (!user) return;

        const resourcesQuery = query(
            collection(db, "resources")
        );

        const unsubscribe = onSnapshot(resourcesQuery, async (snapshot) => {
            const resourcesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAvailableResources(resourcesList);

            // Fetch owner names for each resource
            const owners = {};
            for (const resource of resourcesList) {
                if (!owners[resource.userId]) {
                    const userDoc = await getDoc(doc(db, "users", resource.userId));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        owners[resource.userId] = `${userData.firstName} ${userData.lastName}`;
                    }
                }
            }
            setResourceOwners(owners);
        }, (error) => {
            console.error("Error fetching resources:", error);
        });

        return () => unsubscribe();
    }, [user]);

    const filteredResources = availableResources.filter(resource => 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.id.toString().includes(searchQuery)
    );

    const handleResourceClick = (resource) => {
        setSelectedResource(resource);
    };

    const closeResourceDetails = () => {
        setSelectedResource(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!user) {
            setError('Мора да бидете најавени за да креирате настан');
            setIsSubmitting(false);
            return;
        }

        try {
            // Validate required fields
            if (!formData.title || !formData.date || !formData.location) {
                setError('Сите полиња се задолжителни');
                setIsSubmitting(false);
                return;
            }

            const eventData = {
                ...formData,
                userId: user.uid,
                createdAt: new Date().toISOString(),
                status: 'active',
                visibility: formData.isPrivate ? 'private' : 'public'
            };

            console.log('Creating event with data:', eventData);
            const docRef = await addDoc(collection(db, "events"), eventData);
            console.log("Event created with ID: ", docRef.id);
            
            // Navigate to the appropriate page based on visibility
            if (formData.isPrivate) {
                navigate('/events/private');
            } else {
                navigate('/events/public');
            }
        } catch (error) {
            console.error("Error creating event: ", error);
            setError('Грешка при креирање на настанот. Обидете се повторно.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addResource = (resource) => {
        setFormData(prev => ({
            ...prev,
            resources: [...prev.resources, resource]
        }));
    };

    return (
        <div className="app-container">
            <Navbar user={user} />
            <div className="main-container">
                <Sidebar />
                <div className="form-container">
                    <form className="event-form" onSubmit={handleSubmit}>
                        <h2>Креирај Настан</h2>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-section">
                            <div className="event-form-title">
                                <label>Наслов</label>
                                <div className="event-form-title-input">
                                    <input 
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Внесете наслов на настанот"
                                        required
                                    />
                                    <span className="event-form-checkbox">
                                        <p>Приватен</p>
                                        <input 
                                            id="form-checkbox"
                                            type="checkbox"
                                            name="isPrivate"
                                            checked={formData.isPrivate}
                                            onChange={handleInputChange}
                                        />
                                    </span>
                                </div>
                            </div>

                            <div className="event-form-date">
                                <div className="event-form-date-label">
                                    <label>Датум</label>
                                    <input 
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="event-form-date-label">
                                    <label>Почеток</label>
                                    <input 
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="event-form-date-label">
                                    <label>Крај</label>
                                    <input 
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="event-form-location">
                                <label>Локација</label>
                                <input 
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Внесете локација на настанот"
                                    required
                                />
                            </div>

                            <div className="event-form-description">
                                <label>Опис</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                    placeholder="Внесете опис на настанот"
                                    rows="4"
                                />
                            </div>

                            <div className="event-form-resources">
                                <label>Потребни ресурси</label>
                                <div className="event-form-resources-box">
                                    <div className="card-pills">
                                        {formData.resources.map((resource, index) => (
                                            <span key={index} className="card-pill">
                                                {resource.name}
                                                <button 
                                                    type="button"
                                                    className="remove-resource"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            resources: prev.resources.filter((_, i) => i !== index)
                                                        }));
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Креирање...' : 'Креирај настан'}
                            </button>
                        </div>
                    </form>

                    <div className="event-form-resources-list">
                        <h3>Достапни ресурси</h3>
                        <div className="search-bar">
                            <input 
                                type="search" 
                                placeholder="Пребарувај ресурси" 
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="search-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                </svg>
                            </button>
                        </div>
                        <div className="resources-list">
                            {filteredResources.map((resource) => (
                                <div 
                                    key={resource.id} 
                                    className="resource-item"
                                    onClick={() => handleResourceClick(resource)}
                                >
                                    <div className="resource-info">
                                        <span className="resource-name">{resource.name}</span>
                                        <span className="resource-owner">
                                            {resource.userId === user.uid ? 'Ваш ресурс' : resourceOwners[resource.userId] || 'Непознат корисник'}
                                        </span>
                                    </div>
                                    <div className="resource-status">
                                        <span className="status-badge">Достапни</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedResource && (
                        <div className="resource-details-modal">
                            <div className="resource-details-content">
                                <button className="close-button" onClick={closeResourceDetails}>×</button>
                                <h3>{selectedResource.name}</h3>
                                <div className="resource-details-info">
                                    <p><strong>Категорија:</strong> {selectedResource.category}</p>
                                    <p><strong>Опис:</strong> {selectedResource.description}</p>
                                    <p><strong>Вкупна количина:</strong> {selectedResource.totalQuantity}</p>
                                    <p><strong>Сопственик:</strong> {selectedResource.userId === user.uid ? 'Вие' : resourceOwners[selectedResource.userId] || 'Непознат корисник'}</p>
                                </div>
                                <button 
                                    className="add-resource-button"
                                    onClick={() => {
                                        addResource(selectedResource);
                                        closeResourceDetails();
                                    }}
                                    disabled={formData.resources.some(r => r.id === selectedResource.id)}
                                >
                                    Додади ресурс
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCreate;