const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

let votes = 0;

app.use(express.json());
app.use(session({
    secret: 'jeeting-vote-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));

app.use(express.static(path.join(__dirname, '.')));

app.get('/api/votes', (req, res) => {
    res.json({ votes });
});

app.get('/api/voted', (req, res) => {
    res.json({ voted: !!req.session.voted });
});

app.post('/api/vote', (req, res) => {
    if (req.session.voted) {
        return res.status(409).json({ error: 'Already voted' });
    }
    votes++;
    req.session.voted = true;
    res.json({ success: true, votes });
});

app.listen(PORT, () => {
    console.log(`jeeting vote server running on http://localhost:${PORT}`);
});