const express = require('express');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Rate limiting for checkout
const checkoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many checkout attempts, please try again later.'
});

// API Routes
app.get('/api/items', (req, res) => {
    try {
        const items = JSON.parse(fs.readFileSync('items.json', 'utf8'));
        res.json(items);
    } catch (error) {
        console.error('Error reading items:', error);
        res.status(500).json({ error: 'Failed to load items' });
    }
});

app.post('/api/checkout', checkoutLimiter, (req, res) => {
    console.log('Checkout request:', req.body);
    
    // Dummy Telegram API call (replace with real bot token)
    const botToken = '7707841213:AAH627pVM_RJDrn9NYVhvc1FbGwddL5Kn8I';
    const chatId = '7518612958';
    
    console.log(`Would send to Telegram bot ${botToken} to chat ${chatId}:`, req.body);
    
    res.json({ success: true, message: 'Order received!' });
});

// Admin route to update items
app.post('/api/update-items', (req, res) => {
    const { key, items } = req.body;
    
    if (key !== 'man') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        fs.writeFileSync('items.json', JSON.stringify(items, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating items:', error);
        res.status(500).json({ error: 'Failed to update items' });
    }
});

// Serve admin panel
app.get('/admin', (req, res) => {
    if (req.query.key !== 'Raven123') {
        return res.status(401).send('Access denied. Invalid key.');
    }
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve main app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🏪 Store: http://localhost:${PORT}`);
    console.log(`👑 Admin: http://localhost:${PORT}/admin?key=Raven123`);
});
