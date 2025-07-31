// Global state
let cart = JSON.parse(localStorage.getItem('ravenhaven_cart') || '[]');
let products = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    setupNavigation();
    setupMobileMenu();
});

// API functions
async function fetchProducts() {
    try {
        const response = await fetch('/api/items');
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        showToast('Failed to load products', 'error');
        return [];
    }
}

async function sendCheckout(checkoutData) {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkoutData)
        });
        
        if (!response.ok) {
            throw new Error('Checkout failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Checkout error:', error);
        throw error;
    }
}

// Product functions
async function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '<div class="loading">Loading products...</div>';
    
    products = await fetchProducts();
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="loading">No products available</div>';
        return;
    }
    
    const productsHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+'">
            <h4 class="product-name">${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <div class="product-info">
                <span class="product-price">RM${product.price}</span>
                <span class="product-stock ${product.quantity <= 0 ? 'out-of-stock' : ''}">
                    Stock: ${product.quantity}
                </span>
            </div>
            <button 
                class="add-to-cart-btn" 
                onclick="addToCart('${product.id}')"
                ${product.quantity <= 0 ? 'disabled' : ''}
            >
                ${product.quantity <= 0 ? 
                    '<i class="fas fa-times"></i> Out of Stock' : 
                    '<i class="fas fa-shopping-cart"></i> Add to Cart'
                }
            </button>
        </div>
    `).join('');
    
    productsGrid.innerHTML = productsHTML;
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.quantity <= 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
    
    // Show success animation
    const button = document.querySelector(`[data-product-id="${productId}"] .add-to-cart-btn`);
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.classList.add('added');
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.classList.remove('added');
    }, 1500);
    
    showToast(`${product.name} added to cart!`);
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartCount();
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showToast('Item removed from cart');
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function saveCart() {
    localStorage.setItem('ravenhaven_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = count;
        cartCountElement.style.display = count > 0 ? 'flex' : 'none';
    }
    
    // Update mobile cart count if element exists
    const mobileCartCount = document.getElementById('mobileCartCount');
    if (mobileCartCount) {
        mobileCartCount.textContent = count;
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
        cartFooter.style.display = 'none';
        return;
    }
    
    const cartHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiPk5vIEltZzwvdGV4dD4KPC9zdmc+'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">RM${item.price}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    cartItems.innerHTML = cartHTML;
    cartFooter.style.display = 'block';
    cartTotal.textContent = getCartTotal();
}

// Checkout function
async function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    const originalText = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    checkoutBtn.disabled = true;
    
    try {
        // Send checkout data to backend
        await sendCheckout({
            items: cart,
            total: getCartTotal()
        });
        
        // Generate WhatsApp message
        const message = generateWhatsAppMessage();
        const whatsappNumber = '60123456789'; // Replace with actual number
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Clear cart and close sidebar
        clearCart();
        toggleCart();
        
        showToast('Redirected to WhatsApp to complete your order!');
        
    } catch (error) {
        showToast('Checkout failed. Please try again.', 'error');
    } finally {
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;
    }
}

function generateWhatsAppMessage() {
    const itemsList = cart.map(item => 
        `${item.name} x${item.quantity} - RM${item.price * item.quantity}`
    ).join('\n');
    
    return `Hi, saya nak beli dari RavenHavenStore:\n\n${itemsList}\n\nTotal: RM${getCartTotal()}`;
}

// UI functions
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    const isOpen = sidebar.classList.contains('open');
    
    if (isOpen) {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        updateCartDisplay();
        sidebar.classList.add('open');
        overlay.classList.add('open');
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
    
    // Prevent scrolling when mobile menu is open
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

function setupMobileMenu() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    if (type === 'error') {
        toast.style.borderLeftColor = '#ef4444';
    } else {
        toast.style.borderLeftColor = '#10b981';
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Navigation functions
function setupNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link, .footer-section a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(30, 41, 59, 0.98)';
        } else {
            header.style.background = 'rgba(30, 41, 59, 0.95)';
        }
    });
}

function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('cartSidebar');
    const cartBtn = document.querySelector('.cart-btn');
    
    if (sidebar.classList.contains('open') && 
        !sidebar.contains(event.target) && 
        !cartBtn.contains(event.target)) {
        toggleCart();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Close cart with Escape key
    if (event.key === 'Escape') {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar.classList.contains('open')) {
            toggleCart();
        }
    }
});

// Auto-refresh products every 30 seconds (optional)
setInterval(loadProducts, 30000);