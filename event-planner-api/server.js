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
  database: 'event_planner_db',
  password: 'postgres',
  port: 5432, // Default PostgreSQL port
});

// Тестирање на конекција со базата
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Почетна рутa
app.get('/', (req, res) => {
    res.send('Welcome to the Event Planner API');
});

//// ITEMS API
// Враќа сите артикли
app.get('/api/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items_table');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Враќа артикли по категорија
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

// Враќа артикли по подкатегорија
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
// Враќа сите настани
app.get('/events', async (req, res) => {
    try {
        const events = await pool.query('SELECT * FROM events');
        res.json(events.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Креира нов настан
app.post('/events', async (req, res) => {
    const { name, date, location, description } = req.body;
    // Проверка дали основните полиња се внесени
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

// Враќа настан по ID
app.get('/events/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const event = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

        // Ако настанот не е пронајден
        if (event.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Ажурира настан
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

// Брише настан
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

//// 🔹 NOTIFICATIONS API ////

// Креирање на известување (на пример, кога некој нуди артикал)
app.post('/api/notifications', async (req, res) => {
    const { user_id, message } = req.body;

    // Проверка дали корисникот и пораката се внесени
    if (!user_id || !message) {
        return res.status(400).json({ error: 'User ID and message are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *',
            [user_id, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Враќа известувања за корисник
app.get('/api/notifications/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Означува известување како прочитано
app.put('/api/notifications/:id/read', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ message: 'Notification marked as read', notification: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Стартување на серверот
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
