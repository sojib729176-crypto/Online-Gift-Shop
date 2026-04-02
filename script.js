// --- DATA: Mock Product Database ---
const PRODUCTS = [
    { id: 1, name: "Sunset Spa Wellness Set", price: 55.00, category: "wellness", img: "https://images.unsplash.com/photo-1544175013-4533a016655c?auto=format&fit=crop&w=600" },
    { id: 2, name: "Golden Aura Crystal Vase", price: 120.00, category: "decor", img: "https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&w=600" },
    { id: 3, name: "Smart Harmony Pro Watch", price: 299.00, category: "tech", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600" },
    { id: 4, name: "Turquoise Dream Blanket", price: 85.00, category: "decor", img: "https://images.unsplash.com/photo-1580191947416-62d35a55e71d?auto=format&fit=crop&w=600" }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Cart from Storage
    let cart = JSON.parse(localStorage.getItem('giftsColorfulCart')) || [];
    const productGrid = document.getElementById('productGrid');
    const cartCount = document.getElementById('cartCount');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartDrawer = document.getElementById('cartDrawer');

    // --- RENDER PRODUCTS ---
    function renderProducts(items) {
        productGrid.innerHTML = items.map(p => `
            <div class="product-card ${p.category} revealactive">
                <div class="product-img">
                    <img src="${p.img}" alt="${p.name}">
                    <button class="quick-add gradient-primary" onclick="addToCart(${p.id})"><i class="fa-solid fa-plus"></i></button>
                </div>
                <div class="product-info">
                    <span class="cat-tag ${getCategoryGradient(p.category)}">${p.category}</span>
                    <h3 class="product-title">${p.name}</h3>
                    <p class="price">$${p.price.toFixed(2)}</p>
                </div>
            </div>
        `).join('');
    }

    // Helper for category gradients
    function getCategoryGradient(cat) {
        if(cat === 'wellness') return 'gradient-primary';
        if(cat === 'decor') return 'gradient-secondary';
        if(cat === 'tech') return 'gradient-tech';
        return 'gradient-all';
    }

    // --- FILTER LOGIC ---
    document.querySelectorAll('.pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.pill.active').classList.remove('active');
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
            renderProducts(filtered);
        });
    });

    // --- CART ENGINE ---
    window.addToCart = (id) => {
        const item = PRODUCTS.find(p => p.id === id);
        cart.push(item);
        saveAndRefresh();
        cartDrawer.classList.add('open');
    };

    function saveAndRefresh() {
        localStorage.setItem('giftsColorfulCart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        cartCount.innerText = cart.length;
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-msg">Box Empty.</p>';
        } else {
            cartItemsList.innerHTML = cart.map((item, idx) => `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <strong>$${item.price.toFixed(2)}</strong>
                </div>
            `).join('');
        }
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('cartTotal').innerText = `$${total.toFixed(2)}`;
    }

    // Clear Cart
    document.getElementById('clearCart').addEventListener('click', () => {
        cart = [];
        saveAndRefresh();
    });

    // --- UI CONTROLS ---
    // Theme Switch
    const themeSwitch = document.getElementById('themeSwitch');
    themeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeSwitch.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });

    // Sticky Nav
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 80) nav.classList.add('sticky');
        else nav.classList.remove('sticky');
    });

    // Drawer Controls
    document.getElementById('cartOpen').addEventListener('click', () => cartDrawer.classList.add('open'));
    document.getElementById('closeCart').addEventListener('click', () => cartDrawer.classList.remove('open'));

    // Search Controls
    const sOverlay = document.getElementById('searchOverlay');
    document.getElementById('searchOpen').addEventListener('click', () => {
        sOverlay.style.display = 'flex';
        document.getElementById('megaSearch').focus();
    });
    document.getElementById('closeSearch').addEventListener('click', () => sOverlay.style.display = 'none');

    // Mega Search Filtering
    document.getElementById('megaSearch').addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        const found = PRODUCTS.filter(p => p.name.toLowerCase().includes(val));
        renderProducts(found);
        document.getElementById('searchStats').innerText = `Found ${found.length} items.`;
    });

    // Initial Render
    renderProducts(PRODUCTS);
    updateCartUI();
});
