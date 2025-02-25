const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Middleware to log requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    next();
});

app.get('/events', (req, res) => {
    fs.readFile('/conteudos/event.json', (err, data) => {
        if (err) throw err;
        const events = JSON.parse(data).map(event => ({ ...event, id: event.id.toString() }));
        res.json(events);
    });
});

app.get('/events/:id', (req, res) => {
    fs.readFile('/conteudos/event.json', (err, data) => {
        if (err) throw err;
        const events = JSON.parse(data);
        const event = events.find(event => event.id.toString() === req.params.id);

        if (event) {
            res.json(event);
        } else {
            res.status(404).send('Event not found.');
        }
    });
});

app.post('/events', (req, res) => {
    fs.readFile('/conteudos/event.json', (err, data) => {
        if (err) throw err;
        let events = JSON.parse(data);
        req.body.id = req.body.id.toString();
        events.push(req.body);
        fs.writeFile('/conteudos/event.json', JSON.stringify(events, null, 2), (err) => {
            if (err) throw err;
            res.status(200).send('Event added');
        });
    });
});

// DELETE route to delete an event by ID
app.delete('/events/:id', (req, res) => {
    fs.readFile('/conteudos/event.json', (err, data) => {
        if (err) throw err;
        let events = JSON.parse(data);
        const eventId = req.params.id;
        const eventIndex = events.findIndex(event => event.id.toString() === eventId);

        if (eventIndex !== -1) {
            events.splice(eventIndex, 1);
            fs.writeFile('/conteudos/event.json', JSON.stringify(events, null, 2), (err) => {
                if (err) throw err;
                res.status(200).send(`Event with ID ${eventId} deleted successfully.`);
            });
        } else {
            res.status(404).send('Event not found.');
        }
    });
});

// PUT route to edit an event by ID
app.put('/events/:id', (req, res) => {
    fs.readFile('conteudos/event.json', (err, data) => {
        if (err) throw err;
        let events = JSON.parse(data);
        const eventId = req.params.id;
        const eventIndex = events.findIndex(event => event.id.toString() === eventId);

        if (eventIndex !== -1) {
            events[eventIndex] = { ...events[eventIndex], ...req.body, id: events[eventIndex].id.toString() };
            fs.writeFile('/conteudos/event.json', JSON.stringify(events, null, 2), (err) => {
                if (err) throw err;
                res.status(200).send(`Event with ID ${eventId} updated successfully.`);
            });
        } else {
            res.status(404).send('Event not found.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at https://localhost:${port}`);
});
