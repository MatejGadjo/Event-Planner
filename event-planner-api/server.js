const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'event-planner-db',
  password: 'postgres',
  port: 5432, // Default PostgreSQL port
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Event Planner API');
});

//// ITEMS API
// Get all items
app.get('/api/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items_table');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Get items by category
app.get('/api/items/category/:category_id', async (req, res) => {
    try {
        const { category_id } = req.params;
        const result = await pool.query('SELECT * FROM items_table WHERE category_id = $1', [category_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Get items by subcategory
app.get('/api/items/subcategory/:subcategory_id', async (req, res) => {
    try {
        const { subcategory_id } = req.params;
        const result = await pool.query('SELECT * FROM items_table WHERE subcategory_id = $1', [subcategory_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});


//// EVENTS API
// Get all events
app.get('/events', async (req, res) => {
    try {
        const events = await pool.query('SELECT * FROM events');
        res.json(events.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create an event
app.post('/events', async (req, res) => {
    const { name, date, location, description } = req.body;
    if (!name || !date || !location) {
        return res.status(400).json({ message: 'Name, date, and location are required' });
    }

    try {
        const newEvent = await pool.query(
            'INSERT INTO events (name, date, location, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, date, location, description]
        );

        res.status(201).json({ message: 'Event created successfully', event: newEvent.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Get an event by ID
app.get('/events/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const event = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

        if (event.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update an event
app.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { name, date, location, description } = req.body;

    try {
        const updatedEvent = await pool.query(
            'UPDATE events SET name = $1, date = $2, location = $3, description = $4 WHERE id = $5 RETURNING *',
            [name, date, location, description, id]
        );

        if (updatedEvent.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event updated successfully', event: updatedEvent.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete an event
app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

        if (deletedEvent.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: `Event with ID ${id} deleted successfully` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});