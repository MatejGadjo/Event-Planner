import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import ItemCard from './ItemCard';
import './css/ItemCarousel.css';

const ItemCarousel = ({ user }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <ItemCard 
                    key={resource.id}
                    resource={resource}
                />
            ))}
        </div>
    );
};

export default ItemCarousel;
