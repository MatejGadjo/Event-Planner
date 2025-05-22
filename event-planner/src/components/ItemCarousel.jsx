import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import ItemCard from './ItemCard';
import './css/ItemCarousel.css';

const ItemCarousel = ({ user }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const resourcesQuery = query(
            collection(db, "resources"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(resourcesQuery, (snapshot) => {
            const resourcesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setResources(resourcesList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching resources:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleEdit = (resource) => {
        setSelectedResource(resource);
        setShowEditPopup(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const resourceRef = doc(db, "resources", selectedResource.id);
            await updateDoc(resourceRef, {
                name: selectedResource.name,
                category: selectedResource.category,
                description: selectedResource.description,
                total: selectedResource.total,
                available: selectedResource.total // Reset available to match total
            });
            setShowEditPopup(false);
        } catch (error) {
            console.error("Error updating resource:", error);
        }
    };

    const handleDelete = async (resourceId) => {
        try {
            await deleteDoc(doc(db, "resources", resourceId));
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error("Error deleting resource:", error);
        }
    };

    if (loading) {
        return <div className="item-cards-grid">Вчитување...</div>;
    }

    if (resources.length === 0) {
        return (
            <div className="item-cards-grid empty-state">
                <p>Немате додадено ресурси</p>
                <p className="empty-state-subtitle">Кликнете на + за да додадете нов ресурс</p>
            </div>
        );
    }

    return (
        <div className="item-cards-grid">
            {resources.map((resource) => (
                <div key={resource.id} className="item-card">
                    <div className="item-card-content">
                        <h3>{resource.name}</h3>
                        <p className="item-category">{resource.category}</p>
                        <p className="item-description">{resource.description}</p>
                        <div className="item-stats">
                            <div className="stat">
                                <span className="stat-label">Вкупно:</span>
                                <span className="stat-value">{resource.total}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Слободни:</span>
                                <span className="stat-value">{resource.available}</span>
                            </div>
                        </div>
                        <div className="item-actions">
                            <button 
                                className="edit-button"
                                onClick={() => handleEdit(resource)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                </svg>
                            </button>
                            <button 
                                className="delete-button"
                                onClick={() => setShowDeleteConfirm(resource.id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {showEditPopup && selectedResource && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-button" onClick={() => setShowEditPopup(false)}>×</button>
                        <h2>Уреди ресурс</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Име:</label>
                                <input 
                                    type="text" 
                                    value={selectedResource.name}
                                    onChange={(e) => setSelectedResource({...selectedResource, name: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Категорија:</label>
                                <input 
                                    type="text" 
                                    value={selectedResource.category}
                                    onChange={(e) => setSelectedResource({...selectedResource, category: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Опис:</label>
                                <textarea 
                                    value={selectedResource.description}
                                    onChange={(e) => setSelectedResource({...selectedResource, description: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Вкупна количина:</label>
                                <input 
                                    type="number" 
                                    value={selectedResource.total}
                                    onChange={(e) => setSelectedResource({...selectedResource, total: parseInt(e.target.value)})}
                                    min="0"
                                    required 
                                />
                            </div>
                            <button type="submit" className="submit-button">Зачувај</button>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Избриши ресурс</h2>
                        <p>Дали сте сигурни дека сакате да го избришете овој ресурс?</p>
                        <div className="popup-actions">
                            <button 
                                className="cancel-button"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Откажи
                            </button>
                            <button 
                                className="delete-button"
                                onClick={() => handleDelete(showDeleteConfirm)}
                            >
                                Избриши
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemCarousel;
