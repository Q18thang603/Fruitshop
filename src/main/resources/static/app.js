const tokenKey = 'fruitshop_token';
const usernameKey = 'fruitshop_username';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const productsView = document.getElementById('productsView');
const cartView = document.getElementById('cartView');
const ordersView = document.getElementById('ordersView');
const logoutBtn = document.getElementById('logoutBtn');
const messageBox = document.getElementById('message');
const productsTab = document.getElementById('productsTab');
const cartTab = document.getElementById('cartTab');
const ordersTab = document.getElementById('ordersTab');

const showView = (view) => {
    [productsView, cartView, ordersView].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
};

const showMessage = (text, type = 'success') => {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
    messageBox.classList.remove('hidden');
    setTimeout(() => messageBox.classList.add('hidden'), 5000);
};

const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem(tokenKey);
    options.headers = options.headers || {};
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    if (options.body && !(options.body instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, options);
    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Lỗi kết nối' }));
        throw new Error(error.message || 'Lỗi kết nối');
    }
    return res.json().catch(() => null);
};

const setLoggedIn = (username) => {
    authSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    showMessage(`Chào ${username}`, 'success');
    showView(productsView);
    loadProducts();
};

const checkLogin = () => {
    const username = localStorage.getItem(usernameKey);
    if (localStorage.getItem(tokenKey) && username) {
        setLoggedIn(username);
    }
};

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const data = await apiFetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        localStorage.setItem(tokenKey, data.token);
        localStorage.setItem(usernameKey, data.username);
        setLoggedIn(data.username);
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const phone = document.getElementById('registerPhone').value.trim();
        const data = await apiFetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password, email, phone }),
        });
        localStorage.setItem(tokenKey, data.token);
        localStorage.setItem(usernameKey, data.username);
        setLoggedIn(data.username);
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(usernameKey);
    authSection.classList.remove('hidden');
    appSection.classList.add('hidden');
    logoutBtn.classList.add('hidden');
});

productsTab.addEventListener('click', () => showView(productsView));
cartTab.addEventListener('click', () => {
    showView(cartView);
    loadCart();
});
ordersTab.addEventListener('click', () => {
    showView(ordersView);
    loadOrders();
});

const loadProducts = async () => {
    productsView.innerHTML = '<p>Đang tải sản phẩm...</p>';
    try {
        const products = await apiFetch('/api/products');
        productsView.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" />
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div>${product.description || ''}</div>
                    <div class="product-price">${product.price.toFixed(2)} $</div>
                    <button class="btn" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        productsView.innerHTML = '<p>Không thể tải sản phẩm.</p>';
        showMessage(error.message, 'error');
    }
};

const addToCart = async (productId) => {
    try {
        await apiFetch(`/api/cart/add?productId=${productId}&quantity=1`, { method: 'POST' });
        showMessage('Đã thêm sản phẩm vào giỏ hàng', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
};

const loadCart = async () => {
    cartView.innerHTML = '<p>Đang tải giỏ hàng...</p>';
    try {
        const items = await apiFetch('/api/cart');
        if (!items || items.length === 0) {
            cartView.innerHTML = '<p>Giỏ hàng trống.</p>';
            return;
        }
        let total = 0;
        const list = items.map(item => {
            const lineTotal = item.product.price * item.quantity;
            total += lineTotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <div class="product-title">${item.product.name}</div>
                        <div>Số lượng: ${item.quantity}</div>
                        <div>Giá: ${item.product.price.toFixed(2)} $</div>
                        <div>Tổng: ${lineTotal.toFixed(2)} $</div>
                    </div>
                    <div>
                        <div class="quantity-controls">
                            <button class="btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <button class="btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="btn" onclick="removeCartItem(${item.id})">Xóa</button>
                    </div>
                </div>
            `;
        }).join('');
        cartView.innerHTML = `
            <div class="cart-card">${list}</div>
            <div class="summary">
                <div>Tổng đơn hàng</div>
                <div>${total.toFixed(2)} $</div>
            </div>
            <button class="btn" onclick="checkout()">Thanh toán</button>
        `;
    } catch (error) {
        cartView.innerHTML = '<p>Không thể tải giỏ hàng.</p>';
        showMessage(error.message, 'error');
    }
};

const updateCartQuantity = async (id, quantity) => {
    if (quantity < 1) {
        removeCartItem(id);
        return;
    }
    try {
        await apiFetch(`/api/cart/update/${id}?quantity=${quantity}`, { method: 'PUT' });
        loadCart();
    } catch (error) {
        showMessage(error.message, 'error');
    }
};

const removeCartItem = async (id) => {
    try {
        await apiFetch(`/api/cart/remove/${id}`, { method: 'DELETE' });
        loadCart();
        showMessage('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
};

const checkout = async () => {
    try {
        await apiFetch('/api/orders/create', { method: 'POST' });
        showMessage('Đặt hàng thành công!', 'success');
        loadCart();
    } catch (error) {
        showMessage(error.message, 'error');
    }
};

const loadOrders = async () => {
    ordersView.innerHTML = '<p>Đang tải đơn hàng...</p>';
    try {
        const orders = await apiFetch('/api/orders/my-orders');
        if (!orders || orders.length === 0) {
            ordersView.innerHTML = '<p>Chưa có đơn hàng.</p>';
            return;
        }
        ordersView.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-name">Đơn #${order.id}</div>
                <div class="order-status">Trạng thái: ${order.status}</div>
                <div>Ngày: ${new Date(order.createdAt).toLocaleString()}</div>
                <div>Tổng: ${order.totalPrice.toFixed(2)} $</div>
                <div>Items: ${order.items.map(item => `${item.product.name} x${item.quantity}`).join(', ')}</div>
            </div>
        `).join('');
    } catch (error) {
        ordersView.innerHTML = '<p>Không thể tải đơn hàng.</p>';
        showMessage(error.message, 'error');
    }
};

window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeCartItem = removeCartItem;

checkLogin();
