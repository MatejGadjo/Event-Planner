import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import EventTicket from "./EventTicket";

const EventCarousel = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const eventsQuery = query(
                    collection(db, "events"),
                    where("userId", "==", user.uid)
                );
                
                const querySnapshot = await getDocs(eventsQuery);
                const eventsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setEvents(eventsList);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user]);

    if (loading) {
        return <div className="event-cards-carousel">Loading...</div>;
    }

    if (events.length === 0) {
        return <div className="event-cards-carousel">Немате креирано настани</div>;
    }

    return (
        <div className="event-cards-carousel">
            {events.map((event) => (
                <EventTicket 
                    key={event.id}
                    event={event}
                />
            ))}
        </div>
    );
};

export default EventCarousel;
