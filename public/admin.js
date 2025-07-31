// Global state
let adminKey = '';
let items = [];
let isAuthorized = false;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
});

// Check admin access
function checkAdminAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key');
    
    if (key === 'Raven123') {
        adminKey = key;
        isAuthorized = true;
        showAdminPanel();
        loadItems();
    } else {
        showAccessDenied();
    }
}

function showAdminPanel() {
    document.getElementById('accessDenied').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

function showAccessDenied() {
    document.getElementById('accessDenied').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function goToStore() {
    window.location.href = '/';
}

// API functions
async function fetchItems() {
    try {
        const response = await fetch('/api/items');
        if (!response.ok) throw new Error('Failed to fetch items');
        return await response.json();
    } catch (error) {
        console.error('Error fetching items:', error);
        showToast('Failed to load items', 'error');
        return [];
    }
}

async function updateItems(itemsData) {
    try {
        const response = await fetch('/api/update-items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: adminKey,
                items: itemsData
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update items');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
}

// Load and display items
async function loadItems() {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading items...</div>';
    
    items = await fetchItems();
    
    if (items.length === 0) {
        container.innerHTML = '<div class="loading">No items found</div>';
        return;
    }
    
    updateStatistics();
    renderItemsEditor();
}

function updateStatistics() {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
    const avgPrice = totalItems > 0 ? Math.round(totalValue / totalStock) : 0;
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalValue').textContent = `RM${totalValue}`;
    document.getElementById('totalStock').textContent = totalStock;
    document.getElementById('avgPrice').textContent = `RM${avgPrice}`;
}

function renderItemsEditor() {
    const container = document.getElementById('itemsContainer');
    
    const itemsHTML = items.map((item, index) => `
        <div class="item-edit-card" data-item-id="${item.id}">
            <div class="item-header">
                <img src="${item.image}" alt="${item.name}" class="item-preview" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNGI1NTYzIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4='">
                <div class="item-title">
                    <h3>${item.name}</h3>
                    <p>ID: ${item.id}</p>
                </div>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label" for="name-${index}">Item Name</label>
                    <input 
                        type="text" 
                        id="name-${index}" 
                        class="form-input" 
                        value="${item.name}"
                        onchange="updateItemField(${index}, 'name', this.value)"
                        placeholder="Enter item name"
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="description-${index}">Description</label>
                    <input 
                        type="text" 
                        id="description-${index}" 
                        class="form-input" 
                        value="${item.description}"
                        onchange="updateItemField(${index}, 'description', this.value)"
                        placeholder="Enter item description"
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="price-${index}">Price (RM)</label>
                    <input 
                        type="number" 
                        id="price-${index}" 
                        class="form-input" 
                        value="${item.price}"
                        onchange="updateItemField(${index}, 'price', parseFloat(this.value) || 0)"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="quantity-${index}">Stock Quantity</label>
                    <input 
                        type="number" 
                        id="quantity-${index}" 
                        class="form-input" 
                        value="${item.quantity}"
                        onchange="updateItemField(${index}, 'quantity', parseInt(this.value) || 0)"
                        placeholder="0"
                        min="0"
                    >
                </div>
                
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label class="form-label" for="image-${index}">Image URL</label>
                    <input 
                        type="url" 
                        id="image-${index}" 
                        class="form-input" 
                        value="${item.image}"
                        onchange="updateItemField(${index}, 'image', this.value)"
                        placeholder="https://example.com/image.jpg"
                    >
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = itemsHTML;
}

// Update item field
function updateItemField(index, field, value) {
    if (index >= 0 && index < items.length) {
        items[index][field] = value;
        
        // Update statistics if price or quantity changed
        if (field === 'price' || field === 'quantity') {
            updateStatistics();
        }
        
        // Update preview image if image URL changed
        if (field === 'image') {
            const img = document.querySelector(`[data-item-id="${items[index].id}"] .item-preview`);
            if (img) {
                img.src = value;
            }
        }
        
        // Update item title if name changed
        if (field === 'name') {
            const title = document.querySelector(`[data-item-id="${items[index].id}"] .item-title h3`);
            if (title) {
                title.textContent = value;
            }
        }
    }
}

// Save all changes
async function saveAllChanges() {
    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.innerHTML;
    
    // Validate items
    const invalidItems = items.filter(item => 
        !item.name.trim() || 
        item.price < 0 || 
        item.quantity < 0 || 
        !item.description.trim()
    );
    
    if (invalidItems.length > 0) {
        showToast('Please fix invalid items before saving', 'error');
        return;
    }
    
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;
    
    try {
        await updateItems(items);
        showToast('All changes saved successfully!');
        updateStatistics();
    } catch (error) {
        showToast(error.message || 'Failed to save changes', 'error');
    } finally {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.remove('error');
    
    if (type === 'error') {
        toast.classList.add('error');
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Save with Ctrl+S
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        if (isAuthorized) {
            saveAllChanges();
        }
    }
    
    // Go back with Escape
    if (event.key === 'Escape') {
        goToStore();
    }
});

// Auto-save functionality (optional)
let autoSaveTimeout;
function scheduleAutoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        if (isAuthorized && items.length > 0) {
            console.log('Auto-saving changes...');
            saveAllChanges();
        }
    }, 30000); // Auto-save after 30 seconds of inactivity
}

// Add event listeners for auto-save
document.addEventListener('input', function(event) {
    if (event.target.classList.contains('form-input')) {
        scheduleAutoSave();
    }
});

// Utility functions
function formatCurrency(amount) {
    return `RM${amount.toFixed(2)}`;
}

function validateImageUrl(url) {
    const img = new Image();
    return new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Image validation helper
async function validateAllImages() {
    const invalidImages = [];
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.image && !(await validateImageUrl(item.image))) {
            invalidImages.push(item.name);
        }
    }
    
    if (invalidImages.length > 0) {
        showToast(`Invalid image URLs found for: ${invalidImages.join(', ')}`, 'error');
    }
    
    return invalidImages.length === 0;
}

// Export/Import functionality (bonus feature)
function exportItems() {
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'ravenhaven-items.json';
    link.click();
    
    showToast('Items exported successfully!');
}

function importItems(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedItems = JSON.parse(e.target.result);
            
            // Validate imported data structure
            if (!Array.isArray(importedItems)) {
                throw new Error('Invalid file format');
            }
            
            // Validate each item has required fields
            for (const item of importedItems) {
                if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
                    throw new Error('Invalid item data structure');
                }
            }
            
            items = importedItems;
            updateStatistics();
            renderItemsEditor();
            showToast('Items imported successfully!');
            
        } catch (error) {
            showToast('Failed to import items: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}