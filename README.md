# RavenHavenStore - Roblox Gaming Marketplace

A modern, fullstack e-commerce website for Roblox gaming items with shopping cart, WhatsApp checkout, and admin panel.

## 🚀 Quick Deploy to Render

1. **Fork/Upload this repository to GitHub**
2. **Connect to Render:**
   - Go to [Render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository
3. **Configure Build Settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Node Version: `18+`
4. **Deploy!**

## 🛍️ Features

### Customer Features
- ✅ Modern dark gaming interface with purple/yellow colors
- ✅ Product catalog with 7 Roblox items (weapons, accessories, pets)
- ✅ Shopping cart with localStorage persistence
- ✅ Add/remove/update cart quantities
- ✅ WhatsApp checkout integration
- ✅ Responsive design for mobile/desktop
- ✅ Smooth animations and hover effects

### Admin Features
- ✅ Protected admin panel (key: `Raven123`)
- ✅ Edit item names, prices, quantities, descriptions
- ✅ Real-time inventory statistics
- ✅ File-based storage (no database needed)
- ✅ Input validation and error handling

### Technical Features
- ✅ Rate limiting for checkout protection (5 requests per 15 minutes)
- ✅ Dummy Telegram bot integration
- ✅ File-based JSON storage
- ✅ Simple HTML/CSS/JavaScript structure
- ✅ Express.js backend with RESTful API

## 📱 Usage

### For Customers
1. Visit the main store page
2. Browse 7 premium Roblox items
3. Add items to cart
4. Click "Checkout via WhatsApp"
5. Complete purchase through WhatsApp

### For Admin
1. Visit `/admin?key=Raven123`
2. Edit item details in real-time
3. View inventory statistics
4. Save changes to update the store

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access the application
# Store: http://localhost:5000
# Admin: http://localhost:5000/admin?key=Raven123
```

## 📁 Project Structure

```
RavenHavenStore/
├── public/                 # Static website files
│   ├── index.html         # Main store page
│   ├── admin.html         # Admin panel
│   ├── style.css          # Store styles
│   ├── admin.css          # Admin styles
│   ├── script.js          # Store functionality
│   └── admin.js           # Admin functionality
├── server.js              # Simple Express server
├── items.json             # Product database (auto-generated)
├── package.json           # Dependencies
└── README.md              # This file
```

## ⚙️ Configuration

### WhatsApp Number
Edit the phone number in `public/script.js`:
```javascript
const whatsappNumber = '60123456789'; // Replace with your number
```

### Admin Access Key
The admin key is set to `Raven123`. To change it, update:
- `public/admin.js` (client-side validation)
- `server.js` (server-side validation)

### Telegram Bot (Optional)
Set environment variables for notifications:
- `TELEGRAM_BOT_TOKEN` - Your bot token
- `TELEGRAM_CHAT_ID` - Your chat ID

## 🎯 API Endpoints

- `GET /api/items` - Fetch all products
- `POST /api/checkout` - Process checkout (rate limited)
- `POST /api/update-items` - Update inventory (requires admin key)

## 🔒 Security Features

- Admin panel protected with key authentication
- Rate limiting on checkout endpoint
- Input validation and sanitization
- CORS protection
- Secure file operations

## 🎨 Customization

### Colors
Edit CSS variables in `public/style.css`:
```css
:root {
  --primary: hsl(246, 83%, 65%);    /* Purple */
  --accent: hsl(48, 96%, 53%);      /* Yellow */
  --background: hsl(222, 47%, 11%); /* Dark blue */
}
```

### Products
Modify the default items in `server.js` or use the admin panel.

## 📦 Deployment Options

### Render (Recommended)
- Zero configuration deployment
- Automatic HTTPS
- Custom domain support
- Follow Quick Deploy steps above

### Other Platforms
The app works on any Node.js hosting:
- Heroku
- Vercel
- Railway
- DigitalOcean App Platform

## 🆘 Troubleshooting

### Images not loading
- Check image URLs in admin panel
- Ensure HTTPS URLs for production

### Admin panel not accessible
- Verify URL includes `?key=Raven123`
- Check browser console for errors

### WhatsApp not opening
- Verify phone number format (without +)
- Test on mobile device

## 🤝 Support

Need help? The codebase is designed to be simple and self-contained. All functionality is in the `public/` folder with clear, commented code.

## 📄 License

MIT License - Feel free to modify and use for your projects!