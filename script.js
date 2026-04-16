// script.js – everything working, fun animations, cart badge, toast
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedColor = "Black";
let selectedSize = "M";

// HERO SLIDESHOW (auto + manual)
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}
setInterval(nextSlide, 4800); // creative timing

// CART COUNT BADGE
function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.length;
}

// TOAST ANIMATION (fun “added” instead of boring alert)
function showToast(message) {
    const toast = document.getElementById('toast');
    const text = document.getElementById('toast-text');
    text.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
}

// CART FUNCTIONS
function toggleCart() {
    document.getElementById("cartDrawer").classList.add("active");
    document.getElementById("cartOverlay").classList.add("active");
}
function closeCart() {
    document.getElementById("cartDrawer").classList.remove("active");
    document.getElementById("cartOverlay").classList.remove("active");
}
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}
function loadCart() {
    const container = document.getElementById("cartItems");
    const totalEl = document.getElementById("total");
    if (!container) return;

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, i) => {
        total += Number(item.price);
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img || 'images/clothing/HF.jpg'}" alt="">
                <div>
                    <strong>${item.name}</strong><br>
                    ${item.color} / ${item.size} — R${item.price}
                </div>
                <button onclick="removeItem(${i})" style="margin-left:auto; background:none; border:none; color:#ff2d55;">×</button>
            </div>
        `;
    });
    totalEl.textContent = `Total: R${total}`;
}
function removeItem(i) {
    cart.splice(i, 1);
    saveCart();
    loadCart();
}
function addToCart(name, price, color = "Black", size = "M", img = "images/clothing/HF.jpg") {
    cart.push({ name, price, color, size, img });
    saveCart();
    loadCart();
    showToast(`${name} added to cart`); // fun animation
}

// QUICK ADD FROM OVERLAY
function quickAddToCart(e, element) {
    e.stopPropagation();
    const card = element.parentElement;
    addToCart(card.dataset.name, card.dataset.price, "Black", "M", card.dataset.img);
}

// PRODUCT SHEET
function openSheet(img, name, price) {
    const sheet = document.getElementById("productSheet");
    document.getElementById("sheetImg").src = img;
    document.getElementById("sheetName").textContent = name;
    document.getElementById("sheetPrice").textContent = "R" + price;
    sheet.dataset.name = name;
    sheet.dataset.price = price;
    sheet.classList.add("active");
}
function closeSheet() {
    document.getElementById("productSheet").classList.remove("active");
}
function selectColor(color, btn) {
    selectedColor = color;
    document.querySelectorAll('.options button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}
function selectSize(size, btn) {
    selectedSize = size;
    document.querySelectorAll('.options button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}
function addFromSheet() {
    const sheet = document.getElementById("productSheet");
    addToCart(sheet.dataset.name, sheet.dataset.price, selectedColor, selectedSize);
    closeSheet();
}

// ARTIST POSTER ADD
function addPosterToCart(name, price, btn) {
    addToCart(name, price, "Standard", "One Size", "images/masekela.jpg");
    btn.textContent = "✓ Added!";
    setTimeout(() => { btn.textContent = `Add Poster – R${price}`; }, 1800);
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    loadCart();

    // Product card clicks
    document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (!e.target.closest(".cart-overlay")) {
                openSheet(card.dataset.img, card.dataset.name, card.dataset.price);
            }
        });
    });

    // ESC to close cart
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });
});

// PAYFAST (demo – replace alert with your real integration)
function payNow() {
    if (cart.length === 0) return showToast("Your cart is empty");
    showToast("Redirecting to PayFast secure checkout...");
    // Real integration: window.location = "https://www.payfast.co.za/eng/process?merchant_id=YOUR_ID&...";
    // For now it stays as demo – you can add your merchant keys later
}
function toggleBio(card) {
    const isOpen = card.classList.contains("expanded");

    document.querySelectorAll(".artist-card").forEach(c => {
        c.classList.remove("expanded");
    });

    if (!isOpen) {
        card.classList.add("expanded");
    }
}