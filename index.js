const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(morgan('tiny', (req, res) => res));

var phoneBookEntries = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

// Get all phonebook entries
app.get('/api/persons/', (req, res) => {
    res.status(200).json(phoneBookEntries)
})

// Get phonebook entry for one client
app.get('/api/persons/:id', (req, res) => {
    const entryToReturn = phoneBookEntries.find(
        (entry) => entry.id === req.params.id
    );
    if(!entryToReturn) {
        res.status(404).end("Entry not found")
    }
    res.status(200).json(entryToReturn);       
})

// Delete single phonebook entry
app.delete("/api/persons/:id", (req, res) => {
    phoneBookEntries = phoneBookEntries.filter(entry => entry.id !== req.params.id)
    res.send('Entry succesfully deleted')
});

// Post new phonebook entries
app.post('/api/persons/', (req, res) => {

    if(!req.body.name || !req.body.number) {
        res.status(400).json({ error: "Both name and number are required" });
    }

    if(phoneBookEntries.find(entry => entry.name.toLowerCase() === req.body.name.toLowerCase())) {
        res.status(400).json({ error: "name must be unique" }).end();
    }

    const newEntryObject = {
        id: Math.floor(Math.random() * 10),
        name: req.body.name,
        number: req.body.number
    }
    phoneBookEntries.push(newEntryObject)
    res.json(newEntryObject)
})


// Get info on the number of entries available
app.get('/info', (req, res) => {
    res.send(`<p>Phone book has info for ${phoneBookEntries.length} people</p> <br /> ${new Date()}`)
})




const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Application is running on port", PORT)
})