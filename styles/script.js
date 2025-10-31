let cart = [];
let currentProduct = null;

// Load cart from memory on page load
function loadCart() {
    const savedCart = [];
    cart = savedCart;
    updateCartBadge();
}

// Save cart to memory
function saveCart() {
    updateCartBadge();
}

// Update cart badge with animation
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const currentCount = parseInt(badge.textContent);
    const newCount = cart.length;

    if (newCount > currentCount) {
        badge.classList.add('added');
        setTimeout(() => {
            badge.classList.remove('added');
        }, 500);
    }

    badge.textContent = newCount;
}

// Fetch product data
async function fetchProduct() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/6');
        const product = await response.json();
        currentProduct = product;
        displayProduct(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        document.getElementById('loading').textContent = 'Error loading product';
    }
}

// Display product
function displayProduct(product) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('productPage').classList.remove('hidden');

    document.getElementById('productImage').src = product.image;
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productCategory').textContent = product.category.toUpperCase();

    // Display rating
    const stars = '⭐'.repeat(Math.round(product.rating.rate));
    document.getElementById('productStars').textContent = stars;
    document.getElementById('productRating').textContent =
        `${product.rating.rate} (${product.rating.count} reviews)`;
}

// Add to cart with enhanced animation
function addToCart() {
    if (currentProduct) {
        const existingItem = cart.find(item => item.id === currentProduct.id);

        if (!existingItem) {
            cart.push({
                id: currentProduct.id,
                title: currentProduct.title,
                price: currentProduct.price,
                image: currentProduct.image
            });
            saveCart();

            // Enhanced success animation
            const btn = document.getElementById('addToCartBtn');
            btn.textContent = '✓ Added to Cart!';
            btn.style.background = '#2ecc71';
            btn.classList.remove('floating');

            setTimeout(() => {
                btn.textContent = '🛒 Add to Cart';
                btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                btn.classList.add('floating');
            }, 2000);
        } else {
            alert('This item is already in your cart!');
        }
    }
}

// Display cart
function displayCart() {
    const cartContent = document.getElementById('cartContent');

    if (cart.length === 0) {
        cartContent.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    cartContent.innerHTML = `
                <div class="cart-items">
                    ${cart.map((item, index) => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                            <div class="cart-item-details">
                                <div class="cart-item-title">${item.title}</div>
                                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            </div>
                            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="cart-total">Total: $${total.toFixed(2)}</div>
                    <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
                </div>
            `;
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
}

// Checkout
function checkout() {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Checkout successful! Total: $${total.toFixed(2)}\n\nThank you for your purchase!`);
    cart = [];
    saveCart();
    displayCart();
}

// Navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Update active link
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const page = link.dataset.page;

        // Show/hide pages
        document.getElementById('productPage').classList.add('hidden');
        document.getElementById('cartPage').classList.add('hidden');
        document.getElementById('loading').classList.add('hidden');

        if (page === 'products') {
            document.getElementById('productPage').classList.remove('hidden');
        } else if (page === 'cart') {
            document.getElementById('cartPage').classList.remove('hidden');
            displayCart();
        } else if (page === 'home') {
            alert('Welcome to E-Shop! Browse our amazing products.');
        } else if (page === 'about') {
            alert('E-Shop - Your one-stop destination for quality products!');
        }
    });
});

// Add to cart button
document.getElementById('addToCartBtn').addEventListener('click', addToCart);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize
loadCart();
fetchProduct();