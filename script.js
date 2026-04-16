// ===============================
// FYDT SCRIPT.JS (FIXED VERSION)
// ===============================

// GLOBAL STATE
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedColor = "Black";
let selectedSize = "M";
let isSignedIn = JSON.parse(localStorage.getItem("isSignedIn")) || false;

// SLIDESHOW
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let slideInterval = null;
let slidePlaying = true;

function nextSlide() {
    if (!slides.length) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

function startSlideShow() {
    if (slideInterval || !slides.length) return;

    slideInterval = setInterval(nextSlide, 4800);
    slidePlaying = true;

    const control = document.querySelector('.slide-control');
    if (control) control.textContent = 'Pause';
}

function stopSlideShow() {
    clearInterval(slideInterval);
    slideInterval = null;
    slidePlaying = false;

    const control = document.querySelector('.slide-control');
    if (control) control.textContent = 'Play';
}

function toggleSlidePlay() {
    slidePlaying ? stopSlideShow() : startSlideShow();
}

// ===============================
// TOAST
// ===============================
function showToast(message) {
    const toast = document.getElementById('toast');
    const text = document.getElementById('toast-text');

    if (!toast || !text) return;

    text.textContent = message;
    toast.classList.add('show');

    setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===============================
// SIGN IN
// ===============================
function toggleSignIn() {
    const modal = document.getElementById('signinModalOverlay');

    if (isSignedIn) {
        handleSignOut();
        return;
    }

    if (modal) modal.classList.add('active');
}

function closeSignIn() {
    const modal = document.getElementById('signinModalOverlay');
    if (modal) modal.classList.remove('active');
}

function handleSignIn(e) {
    e.preventDefault();

    isSignedIn = true;
    localStorage.setItem("isSignedIn", JSON.stringify(true));

    closeSignIn();
    updateSignInButton();
    showToast("Successfully signed in!");
}

function handleSignOut() {
    isSignedIn = false;
    localStorage.setItem("isSignedIn", JSON.stringify(false));

    updateSignInButton();
    showToast("Signed out");
}

function updateSignInButton() {
    const icon = document.querySelector('.icon-btn i');

    if (icon) {
        icon.className = isSignedIn ? 'fas fa-sign-out-alt' : 'fas fa-user';
    }
}

// ===============================
// CART
// ===============================
function updateCartCount() {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = cart.length;
}

function toggleCart() {
    if (!isSignedIn) {
        showToast("Please sign in first");
        toggleSignIn();
        return;
    }

    document.getElementById("cartDrawer")?.classList.add("active");
    document.getElementById("cartOverlay")?.classList.add("active");
}

function closeCart() {
    document.getElementById("cartDrawer")?.classList.remove("active");
    document.getElementById("cartOverlay")?.classList.remove("active");
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function loadCart() {
    const container = document.getElementById("cartItems");
    const totalEl = document.getElementById("total");

    if (!container || !totalEl) return;

    container.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center;padding:30px'>Cart is empty</p>";
        totalEl.textContent = "Total: R0";
        return;
    }

    cart.forEach((item, i) => {
        total += Number(item.price);

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" />
                <div class="cart-item-details">
                    <strong>${item.name}</strong>
                    <span>${item.color} / ${item.size}</span>
                </div>
                <button onclick="removeItem(${i})">❌</button>
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

function addToCart(name, price, color = "Black", size = "M", img = "") {
    cart.push({ name, price, color, size, img });
    saveCart();
    loadCart();
    showToast(`${name} added`);
}

// ===============================
// PRODUCT SHEET (safe version)
// ===============================
function openSheet(img, name, price, front, back) {
    const sheet = document.getElementById("productSheet");
    if (!sheet) return;

    document.getElementById("sheetImg").src = img;
    document.getElementById("sheetName").textContent = name;
    document.getElementById("sheetPrice").textContent = "R" + price;

    sheet.dataset.name = name;
    sheet.dataset.price = price;
    sheet.dataset.front = front || img;
    sheet.dataset.back = back || img;

    sheet.classList.add("active");
}

function closeSheet() {
    document.getElementById("productSheet")?.classList.remove("active");
}

function addFromSheet() {
    const sheet = document.getElementById("productSheet");

    addToCart(
        sheet.dataset.name,
        sheet.dataset.price,
        selectedColor,
        selectedSize,
        document.getElementById("sheetImg").src
    );

    closeSheet();
}

// ===============================
// ARTIST MODAL (FIXED — THIS WAS BROKEN)
// ===============================
function openArtistModal(card) {
    const modal = document.getElementById("artistModalOverlay");
    if (!modal) return;

    document.getElementById("modalImage").src = card.dataset.image;
    document.getElementById("modalName").textContent = card.dataset.name || "";
    document.getElementById("modalYears").textContent = card.dataset.years || "";
    document.getElementById("modalNickname").textContent = card.dataset.nickname || "";
    document.getElementById("modalOrigin").textContent = card.dataset.origin || "";
    document.getElementById("modalSong").textContent = card.dataset.song || "";
    document.getElementById("modalLegacy").textContent = card.dataset.legacy || "";
    document.getElementById("modalBio").textContent = card.dataset.bio || "";
    document.getElementById("modalQuote").textContent = `"${card.dataset.quote || ""}"`;

    modal.classList.add("active");
}

function closeArtistModal() {
    document.getElementById("artistModalOverlay")?.classList.remove("active");
}

function addPosterToCartFromModal() {
    addToCart("Poster", 150, "Standard", "One Size", "images/masekela.jpg");
}

// ===============================
// INIT (SAFE)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();
    loadCart();
    updateSignInButton();
    startSlideShow();

    // close modal on overlay click
    const modal = document.getElementById("artistModalOverlay");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeArtistModal();
        });
    }

    // ESC key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeCart();
            closeArtistModal();
            closeSheet();
        }
    });
});

// ===============================
// IMAGE HOVER SWAP (FIXED)
// ===============================
document.querySelectorAll(".product-card").forEach(card => {
    const img = card.querySelector("img");

    const front = card.dataset.front;
    const back = card.dataset.back;

    if (!img || !front || !back) return;

    card.addEventListener("mouseenter", () => {
        img.src = back;
    });

    card.addEventListener("mouseleave", () => {
        img.src = front;
    });
});

// ===============================
// IMAGE HOVER SWAP (FIXED)
// ===============================
document.querySelectorAll(".product-card").forEach(card => {
    const img = card.querySelector("img");

    const front = card.dataset.front;
    const back = card.dataset.back;

    if (!img || !front || !back) return;

    card.addEventListener("mouseenter", () => {
        img.src = back;
    });

    card.addEventListener("mouseleave", () => {
        img.src = front;
    });
});
