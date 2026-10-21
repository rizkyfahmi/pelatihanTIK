/**
 * ==========================================================================
 * KAFE KITA - SCRIPT (Vanilla JavaScript)
 * Logika Pengelolaan Menu, Keranjang Belanja, localStorage, dan Simulasi Checkout
 * ==========================================================================
 */

// 1. DATA MASTER MENU (Array of Objects)
const MENU_DATA = [
    {
        id: 1,
        name: "Kopi Latte",
        category: "Minuman",
        price: 15000,
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&auto=format&fit=crop&q=80",
        description: "Espresso lembut berpadu susu steamed segar dengan lapisan micro-foam halus."
    },
    {
        id: 2,
        name: "Americano",
        category: "Minuman",
        price: 12000,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80",
        description: "Ekstrak espresso pekat khas Nusantara yang dilarutkan air panas, mantap dan berkarakter."
    },
    {
        id: 3,
        name: "Matcha Latte",
        category: "Minuman",
        price: 18000,
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80",
        description: "Bubuk matcha premium Jepang dipadukan susu creamy yang manis dan menenangkan."
    },
    {
        id: 4,
        name: "Cokelat Panas",
        category: "Minuman",
        price: 16000,
        image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=80",
        description: "Kelezatan cokelat hitam pekat asli berpadu susu hangat, cocok untuk penghangat hari."
    },
    {
        id: 5,
        name: "Croissant",
        category: "Makanan",
        price: 14000,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80",
        description: "Pastry khas Perancis yang renyah di luar, beraroma mentega gurih dan lembut di dalam."
    },
    {
        id: 6,
        name: "Chocolate Cake",
        category: "Makanan",
        price: 20000,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80",
        description: "Kue cokelat panggang berlapis ganache pekat yang moist, manis, dan memanjakan lidah."
    },
    {
        id: 7,
        name: "Sandwich",
        category: "Makanan",
        price: 22000,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80",
        description: "Roti gandum panggang isi daging asap, keju leleh, telur, dan selada segar gurih."
    },
    {
        id: 8,
        name: "French Fries",
        category: "Makanan",
        price: 15000,
        image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80",
        description: "Kentang goreng renyah bumbu rempah pilihan, disajikan hangat dengan saus cocolan."
    }
];

// 2. STATE APLIKASI (Keranjang Belanja)
const STORAGE_KEY = 'kafe_kita_cart';
let cart = loadCartFromStorage();

// 3. ELEMEN DOM UTAMA
const menuGrid = document.getElementById('menuGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

const cartBtn = document.getElementById('cartBtn');
const cartCountBadge = document.getElementById('cartCountBadge');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotalPrice = document.getElementById('cartTotalPrice');

const openCheckoutBtn = document.getElementById('openCheckoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
const cancelCheckoutBtn = document.getElementById('cancelCheckoutBtn');
const checkoutForm = document.getElementById('checkoutForm');
const customerNameInput = document.getElementById('customerName');
const orderNotesInput = document.getElementById('orderNotes');
const nameError = document.getElementById('nameError');
const checkoutSummaryItems = document.getElementById('checkoutSummaryItems');
const checkoutSummaryTotal = document.getElementById('checkoutSummaryTotal');

const successModal = document.getElementById('successModal');
const successCustomerMessage = document.getElementById('successCustomerMessage');
const successReceipt = document.getElementById('successReceipt');
const finishOrderBtn = document.getElementById('finishOrderBtn');

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// 4. FUNGSI PEMBANTU (HELPERS)

// Format Mata Uang Rupiah (IDR)
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp ');
}

// Muat keranjang dari localStorage dengan aman
function loadCartFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Gagal membaca keranjang dari localStorage:", error);
    }
    return [];
}

// Simpan keranjang ke localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error("Gagal menyimpan keranjang ke localStorage:", error);
    }
}

// 5. RENDERING DAFTAR MENU
function renderMenu(category = 'all') {
    if (!menuGrid) return;
    menuGrid.innerHTML = '';

    const filteredMenu = category === 'all'
        ? MENU_DATA
        : MENU_DATA.filter(item => item.category.toLowerCase() === category.toLowerCase());

    filteredMenu.forEach(item => {
        const card = document.createElement('article');
        card.className = 'menu-card';

        card.innerHTML = `
            <div class="menu-image-wrapper">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <span class="menu-category-badge">${item.category}</span>
            </div>
            <div class="menu-body">
                <h3 class="menu-name">${item.name}</h3>
                <p class="menu-price">${formatRupiah(item.price)}</p>
                <button class="btn-add-cart" data-id="${item.id}" aria-label="Tambah ${item.name} ke keranjang">
                    <span>🛒 Tambah ke Keranjang</span>
                </button>
            </div>
        `;

        menuGrid.appendChild(card);
    });

    // Pasang event listener ke tombol tambah
    const addBtns = menuGrid.querySelectorAll('.btn-add-cart');
    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.getAttribute('data-id'), 10);
            addToCart(productId);
        });
    });
}

// 6. LOGIKA PENGELOLAAN KERANJANG

// Tambah item ke keranjang
function addToCart(productId) {
    const product = MENU_DATA.find(item => item.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartUI();
    openCartDrawer();
}

// Perbarui jumlah (tambah / kurang)
function updateCartItemQty(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += change;

    // Jika jumlah kurang dari 1, hapus item
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }

    saveCartToStorage();
    updateCartUI();
}

// Hapus item dari keranjang
function removeCartItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
}

// Hitung total harga & jumlah item
function getCartTotals() {
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    return { totalItems, totalPrice };
}

// Render tampilan isi keranjang
function updateCartUI() {
    const { totalItems, totalPrice } = getCartTotals();

    // Update badge di navbar
    if (cartCountBadge) {
        cartCountBadge.textContent = totalItems;
        cartCountBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }

    // Update total harga
    if (cartTotalPrice) {
        cartTotalPrice.textContent = formatRupiah(totalPrice);
    }

    // Aktifkan / nonaktifkan tombol checkout
    if (openCheckoutBtn) {
        openCheckoutBtn.disabled = cart.length === 0;
        openCheckoutBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
        openCheckoutBtn.style.cursor = cart.length === 0 ? 'not-allowed' : 'pointer';
    }

    // Render list produk dalam keranjang
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart-state">
                <span class="empty-cart-icon">🛒</span>
                <h4>Keranjang Masih Kosong</h4>
                <p>Yuk, pilih minuman atau makanan lezat kesukaanmu di menu!</p>
            </div>
        `;
        return;
    }

    cart.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';

        const subtotal = item.price * item.quantity;

        itemRow.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">${formatRupiah(item.price)}</p>
                <p class="cart-item-subtotal">${formatRupiah(subtotal)}</p>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn btn-minus" data-id="${item.id}" aria-label="Kurangi jumlah">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn btn-plus" data-id="${item.id}" aria-label="Tambah jumlah">+</button>
            </div>
            <button class="remove-item-btn" data-id="${item.id}" aria-label="Hapus item">&times;</button>
        `;

        cartItemsList.appendChild(itemRow);
    });

    // Pasang listener pada tombol minus, plus, dan remove
    cartItemsList.querySelectorAll('.btn-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'), 10);
            updateCartItemQty(id, -1);
        });
    });

    cartItemsList.querySelectorAll('.btn-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'), 10);
            updateCartItemQty(id, 1);
        });
    });

    cartItemsList.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'), 10);
            removeCartItem(id);
        });
    });
}

// 7. KONTROL DRAWER KERANJANG
function openCartDrawer() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Kunci scroll halaman belakang
    }
}

function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// 8. LOGIKA CHECKOUT & SIMULASI
function openCheckout() {
    if (cart.length === 0) return;

    closeCartDrawer();

    // Render ringkasan pesanan di modal checkout
    if (checkoutSummaryItems) {
        checkoutSummaryItems.innerHTML = '';
        cart.forEach(item => {
            const row = document.createElement('div');
            row.className = 'checkout-summary-item';
            row.innerHTML = `
                <span>${item.name} (${item.quantity}x)</span>
                <span>${formatRupiah(item.price * item.quantity)}</span>
            `;
            checkoutSummaryItems.appendChild(row);
        });
    }

    const { totalPrice } = getCartTotals();
    if (checkoutSummaryTotal) {
        checkoutSummaryTotal.textContent = formatRupiah(totalPrice);
    }

    // Reset pesan error
    if (nameError) {
        nameError.textContent = '';
        nameError.classList.remove('visible');
    }

    if (checkoutModal) {
        checkoutModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    if (customerNameInput) {
        customerNameInput.focus();
    }
}

function closeCheckout() {
    if (checkoutModal) {
        checkoutModal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Submit Form Checkout
function handleCheckoutSubmit(e) {
    e.preventDefault();

    const name = customerNameInput ? customerNameInput.value.trim() : '';
    const notes = orderNotesInput ? orderNotesInput.value.trim() : '';

    // Validasi Nama Pelanggan
    if (!name) {
        if (nameError) {
            nameError.textContent = 'Mohon masukkan nama lengkap Anda untuk pemesanan.';
            nameError.classList.add('visible');
        }
        if (customerNameInput) customerNameInput.focus();
        return;
    }

    // Buat salinan data struk sebelum keranjang dikosongkan
    const orderItems = [...cart];
    const { totalPrice, totalItems } = getCartTotals();

    // Kosongkan keranjang setelah checkout berhasil
    cart = [];
    saveCartToStorage();
    updateCartUI();

    // Tutup modal form checkout
    closeCheckout();
    if (checkoutForm) checkoutForm.reset();

    // Tampilkan Modal Sukses Simulasi
    showSuccessReceipt(name, notes, orderItems, totalPrice, totalItems);
}

// Tampilkan Struk Bukti Simulasi
function showSuccessReceipt(name, notes, items, total, totalCount) {
    if (successCustomerMessage) {
        successCustomerMessage.textContent = `Terima kasih, Kak ${name}! Pesanan Anda siap kami racik.`;
    }

    if (successReceipt) {
        let itemsHtml = '';
        items.forEach(item => {
            itemsHtml += `
                <div class="receipt-row">
                    <span>${item.name} x${item.quantity}</span>
                    <span>${formatRupiah(item.price * item.quantity)}</span>
                </div>
            `;
        });

        successReceipt.innerHTML = `
            <div class="receipt-row">
                <strong>Nama Pemesan:</strong>
                <span>${escapeHtml(name)}</span>
            </div>
            ${notes ? `
            <div class="receipt-row">
                <strong>Catatan:</strong>
                <span><em>${escapeHtml(notes)}</em></span>
            </div>` : ''}
            <div class="receipt-divider"></div>
            ${itemsHtml}
            <div class="receipt-divider"></div>
            <div class="receipt-row" style="font-size: 1rem; font-weight: bold; color: var(--primary-color);">
                <span>Total (${totalCount} item):</span>
                <span>${formatRupiah(total)}</span>
            </div>
        `;
    }

    if (successModal) {
        successModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

// Tutup Modal Sukses
function closeSuccessModal() {
    if (successModal) {
        successModal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Sanitasi teks sederhana untuk proteksi XSS saat menampilkan input pengguna
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 9. EVENT LISTENERS & INISIALISASI
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Menu Pertama Kali
    renderMenu('all');

    // 2. Render Keranjang dari localStorage
    updateCartUI();

    // 3. Tombol Filter Menu
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            renderMenu(category);
        });
    });

    // 4. Buka & Tutup Keranjang
    if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

    // 5. Checkout Modal
    if (openCheckoutBtn) openCheckoutBtn.addEventListener('click', openCheckout);
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);
    if (cancelCheckoutBtn) cancelCheckoutBtn.addEventListener('click', closeCheckout);
    if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckoutSubmit);

    // 6. Modal Sukses
    if (finishOrderBtn) finishOrderBtn.addEventListener('click', closeSuccessModal);

    // 7. Tutup modal ketika klik di area luar
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeCheckout();
        if (e.target === successModal) closeSuccessModal();
    });

    // 8. Tutup dengan tombol Escape di keyboard
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCartDrawer();
            closeCheckout();
            closeSuccessModal();
        }
    });

    // 9. Menu Hamburger Mobile
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        // Tutup menu mobile ketika link ditekan
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }
});
