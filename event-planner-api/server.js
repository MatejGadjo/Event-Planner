const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Routes

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Event Planner API');
});

// Create an event
app.post('/events', (req, res) => {
    const { name, date, location, description } = req.body;
    if (!name || !date || !location) {
        return res.status(400).json({ message: 'Name, date, and location are required' });
    }

    // Simulate saving to the database
    const event = { id: Date.now(), name, date, location, description };

    // Respond with the created event
    res.status(201).json({ message: 'Event created successfully', event });
});

// Get all events
app.get('/events', (req, res) => {
    // Simulate fetching from the database
    const events = [
        { id: 1, name: 'Birthday Party', date: '2025-03-01', location: 'New York', description: 'A fun birthday celebration.' },
        { id: 2, name: 'Wedding', date: '2025-05-15', location: 'Los Angeles', description: 'A beautiful wedding ceremony.' },
    ];

    res.json(events);
});

// Get an event by ID
app.get('/events/:id', (req, res) => {
    const { id } = req.params;

    // Simulate fetching from the database
    const event = { id, name: 'Sample Event', date: '2025-03-01', location: 'New York', description: 'A sample event description.' };

    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
});

// Update an event
app.put('/events/:id', (req, res) => {
    const { id } = req.params;
    const { name, date, location, description } = req.body;

    // Simulate updating the database
    const updatedEvent = { id, name, date, location, description };

    res.json({ message: 'Event updated successfully', updatedEvent });
});

// Delete an event
app.delete('/events/:id', (req, res) => {
    const { id } = req.params;

    // Simulate deletion from the database
    res.json({ message: `Event with ID ${id} deleted successfully` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
