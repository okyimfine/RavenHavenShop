# RavenHavenStore - Complete Deployment Guide

## 🚨 IMPORTANT: Remove TypeScript Files

You currently have old TypeScript files that aren't needed. Here's how to clean them up:

### Files to DELETE (you don't need these):
```
- client/ (entire folder)
- server/ (entire folder) 
- shared/ (entire folder)
- tsconfig.json
- vite.config.ts
- tailwind.config.ts
- components.json
- drizzle.config.ts
- postcss.config.js
```

### Files to KEEP (these are your actual app):
```
- public/ (contains your HTML/CSS/JS app)
- items.json (your product data)
- start-server.js (your simple server)
- package-simple.json (simple dependencies)
- DEPLOYMENT-GUIDE.md (this guide)
- README.md
```

## 📝 Admin Panel Access

### How to Access Admin Panel:

1. **URL Format:** `your-website.com/admin?key=Raven123`
2. **Local Testing:** `http://localhost:5000/admin?key=Raven123`
3. **Password:** `Raven123` (change this in start-server.js if needed)

### Admin Features:
- Add new products
- Edit existing products
- Update prices and stock
- Delete products
- Real-time inventory management

### Changing Admin Password:
Edit `start-server.js` and change `Raven123` to your desired password:
```javascript
if (req.query.key !== 'YOUR_NEW_PASSWORD') {
```

## 🚀 Render Deployment Guide

### Step 1: Prepare Your Files

1. **Create a new folder** called `ravenhaven-simple`
2. **Copy only these files** to the new folder:
   ```
   ravenhaven-simple/
   ├── public/
   │   ├── index.html
   │   ├── style.css
   │   ├── script.js
   │   ├── admin.html
   │   ├── admin.js
   │   └── admin.css
   ├── items.json
   ├── start-server.js
   ├── package-simple.json (rename to package.json)
   └── README.md
   ```

3. **Rename** `package-simple.json` to `package.json`

### Step 2: Upload to GitHub

1. Go to GitHub.com
2. Create a new repository called `ravenhaven-store`
3. Upload your `ravenhaven-simple` folder contents
4. Make sure `package.json` and `start-server.js` are in the root

### Step 3: Deploy on Render

1. **Go to Render.com** and sign up/login
2. **Click "New +"** and select "Web Service"
3. **Connect your GitHub** repository
4. **Configure the deployment:**
   ```
   Name: ravenhaven-store
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
5. **Click "Deploy Web Service"**

### Step 4: Set Environment Variables (Optional)

If you want to change settings:
```
PORT=10000 (Render sets this automatically)
NODE_ENV=production
```

### Step 5: Access Your Live Site

After deployment:
- **Store:** `https://your-app-name.onrender.com`
- **Admin:** `https://your-app-name.onrender.com/admin?key=Raven123`

## 🔧 Local Development

### Quick Start:
```bash
# Install dependencies
npm install

# Start server
npm start

# Access locally
# Store: http://localhost:5000
# Admin: http://localhost:5000/admin?key=Raven123
```

### File Structure:
```
public/
├── index.html          # Main store page
├── style.css           # All styles (cyan/teal theme)
├── script.js           # All functionality (cart, mobile menu)
├── admin.html          # Admin panel page
├── admin.js            # Admin functionality
└── admin.css           # Admin styles

items.json              # Product database
start-server.js         # Simple Express server
package.json            # Dependencies
```

## 📱 Features Included

### Customer Features:
- ✅ 7 Roblox gaming products
- ✅ Shopping cart with localStorage
- ✅ Mobile-responsive design
- ✅ Mobile menu with smooth animations
- ✅ WhatsApp checkout integration
- ✅ Modern cyan/teal color scheme
- ✅ Smooth scrolling navigation

### Admin Features:
- ✅ Add/edit/delete products
- ✅ Real-time inventory management
- ✅ Secure password protection
- ✅ User-friendly interface

### Technical Features:
- ✅ No database required (uses JSON file)
- ✅ Rate limiting for security
- ✅ Mobile-first responsive design
- ✅ Fast loading (no complex frameworks)
- ✅ SEO optimized

## 🔐 Security Notes

- Admin panel is password protected
- Rate limiting prevents spam
- No sensitive data stored in files
- Safe for public deployment

## 📞 WhatsApp Integration

The checkout system automatically generates WhatsApp messages with:
- Customer's selected items
- Quantities and prices
- Total amount
- Formatted for easy reading

## 🎨 Customization

### Colors:
Edit `public/style.css` to change the cyan/teal theme

### Products:
Edit `items.json` or use the admin panel

### WhatsApp Number:
Edit `public/script.js` and change `whatsappNumber = '60123456789'`

## ❓ Troubleshooting

### Common Issues:

1. **TypeScript Errors:** Delete all .ts/.tsx files
2. **Admin Access Denied:** Check URL has `?key=Raven123`
3. **Deploy Fails:** Make sure `package.json` is in root
4. **Mobile Menu Not Working:** Clear browser cache

Need help? The store is designed to be simple and work on any hosting platform!