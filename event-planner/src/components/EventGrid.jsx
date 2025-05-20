import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import EventCard from './EventCard';
import { useLocation } from 'react-router-dom';
import './css/EventGrid.css';

const EventGrid = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    useEffect(() => {
        const isPrivatePage = location.pathname.includes('/private');
        
        const eventsQuery = query(
            collection(db, "events"),
            where("visibility", "==", isPrivatePage ? "private" : "public")
        );

        const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
            const eventsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(eventsList);
            setFilteredEvents(eventsList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching events:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [location.pathname]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredEvents(events);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = events.filter(event => 
            event.title.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query) ||
            event.description?.toLowerCase().includes(query)
        );
        setFilteredEvents(filtered);
    }, [searchQuery, events]);

    if (loading) {
        return <div className="cards-grid">Вчитување...</div>;
    }

    return (
        <div className="event-grid-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Пребарај настани..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>
            {filteredEvents.length === 0 ? (
                <div className="cards-grid empty-state">
                    <p>Нема пронајдено настани</p>
                    <p className="empty-state-subtitle">
                        {location.pathname.includes('/private') 
                            ? 'Креирајте нов приватнен настан' 
                            : 'Нема јавни настани во моментов'}
                    </p>
                </div>
            ) : (
                <div className="cards-grid">
                    {filteredEvents.map((event) => (
                        <EventCard 
                            key={event.id}
                            event={event}
                            user={user}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventGrid;
