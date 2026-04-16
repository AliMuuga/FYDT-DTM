// script.js – everything working, fun animations, cart badge, toast
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedColor = "Black";
let selectedSize = "M";
let isSignedIn = JSON.parse(localStorage.getItem("isSignedIn")) || false;

// HERO SLIDESHOW (auto + manual)
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let slideInterval = null;
let slidePlaying = true;
function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}
function startSlideShow() {
    if (slideInterval || slides.length === 0) return;
    slideInterval = setInterval(nextSlide, 4800);
    slidePlaying = true;
    const control = document.querySelector('.slide-control');
    if (control) control.textContent = 'Pause';
}
function stopSlideShow() {
    if (!slideInterval) return;
    clearInterval(slideInterval);
    slideInterval = null;
    slidePlaying = false;
    const control = document.querySelector('.slide-control');
    if (control) control.textContent = 'Play';
}
function toggleSlidePlay() {
    if (slidePlaying) {
        stopSlideShow();
    } else {
        startSlideShow();
    }
}

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

// SIGN IN FUNCTIONS
function toggleSignIn() {
    if (isSignedIn) {
        handleSignOut();
    } else {
        document.getElementById('signinModalOverlay').classList.add('active');
    }
}

function closeSignIn() {
    document.getElementById('signinModalOverlay').classList.remove('active');
}

function handleSignIn(event) {
    event.preventDefault();
    // Demo sign in - accept any credentials
    isSignedIn = true;
    localStorage.setItem("isSignedIn", JSON.stringify(isSignedIn));
    closeSignIn();
    showToast("Successfully signed in!");
    updateSignInButton();
}

function handleSignOut() {
    isSignedIn = false;
    localStorage.setItem("isSignedIn", JSON.stringify(isSignedIn));
    showToast("Signed out");
    updateSignInButton();
}

function updateSignInButton() {
    const signInBtn = document.querySelector('.icon-btn[onclick="toggleSignIn()"] i');
    if (signInBtn) {
        signInBtn.className = isSignedIn ? 'fas fa-sign-out-alt' : 'fas fa-user';
    }
    const statusText = document.getElementById('signinStatusText');
    const statusArea = document.getElementById('signinStatus');
    if (statusArea && statusText) {
        if (isSignedIn) {
            statusArea.style.display = 'flex';
            statusText.textContent = 'Signed in. Tap to sign out.';
        } else {
            statusArea.style.display = 'none';
            statusText.textContent = '';
        }
    }
}

function toggleCart() {
    if (!isSignedIn) {
        showToast("Please sign in to access your cart");
        toggleSignIn();
        return;
    }
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

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px 0;">Your cart is empty</p>';
        totalEl.textContent = "Total: R0";
        return;
    }

    cart.forEach((item, i) => {
        total += Number(item.price);
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img || 'images/clothing/HF.jpg'}" alt="">
                <div class="cart-item-details">
                    <strong>${item.name}</strong>
                    <span>${item.color} / ${item.size}</span>
                </div>
                <button class="cart-item-remove" onclick="removeItem(${i})">&times;</button>
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
function openSheet(img, name, price, front, back) {
    const sheet = document.getElementById("productSheet");
    document.getElementById("sheetImg").src = img;
    document.getElementById("sheetName").textContent = name;
    document.getElementById("sheetPrice").textContent = "R" + price;
    sheet.dataset.name = name;
    sheet.dataset.price = price;
    sheet.dataset.img = img;
    sheet.dataset.front = front || img;
    sheet.dataset.back = back || img;
    selectedColor = "Black"; // default
    updateSheetImage();
    sheet.classList.add("active");
}
function closeSheet() {
    document.getElementById("productSheet").classList.remove("active");
}
function selectColor(color, btn) {
    selectedColor = color;
    document.querySelectorAll('.options button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateSheetImage();
}
function updateSheetImage() {
    const sheet = document.getElementById("productSheet");
    const baseImg = sheet.dataset.img.replace('.jpg', '');
    const colorImg = baseImg + '_' + selectedColor.toLowerCase() + '.jpg';
    document.getElementById("sheetImg").src = colorImg;
}
function selectSize(size, btn) {
    selectedSize = size;
    document.querySelectorAll('.options button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}
function addFromSheet() {
    const sheet = document.getElementById("productSheet");
    addToCart(sheet.dataset.name, sheet.dataset.price, selectedColor, selectedSize, document.getElementById("sheetImg").src);
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
    updateSignInButton();
    startSlideShow();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Product card clicks
    // Initialize image hover effects
    document.querySelectorAll(".product-card").forEach(card => {
        const img = card.querySelector(".product-img");
        const frontImg = card.dataset.front;
        const backImg = card.dataset.back;
        
        card.addEventListener("mouseenter", () => {
            if (backImg && img) {
                img.style.opacity = "0";
                setTimeout(() => {
                    img.src = backImg;
                    img.style.opacity = "1";
                }, 250);
            }
        });
        
        card.addEventListener("mouseleave", () => {
            if (frontImg && img) {
                img.style.opacity = "0";
                setTimeout(() => {
                    img.src = frontImg;
                    img.style.opacity = "1";
                }, 250);
            }
        });
    });
    
    document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (!e.target.closest(".cart-overlay")) {
                const img = card.querySelector(".product-img");
                openSheet(img.src, card.dataset.name, card.dataset.price, card.dataset.front, card.dataset.back);
            }
        });
    });

    // Product sheet image hover effects
    const sheetImg = document.getElementById("sheetImg");
    if (sheetImg) {
        sheetImg.addEventListener("mouseenter", () => {
            const sheet = document.getElementById("productSheet");
            const backImg = sheet?.dataset.back;
            if (backImg && backImg !== sheetImg.src) {
                sheetImg.style.opacity = "0";
                setTimeout(() => {
                    sheetImg.src = backImg;
                    sheetImg.style.opacity = "1";
                }, 250);
            }
        });
        
        sheetImg.addEventListener("mouseleave", () => {
            const sheet = document.getElementById("productSheet");
            const frontImg = sheet?.dataset.front;
            if (frontImg && frontImg !== sheetImg.src) {
                sheetImg.style.opacity = "0";
                setTimeout(() => {
                    sheetImg.src = frontImg;
                    sheetImg.style.opacity = "1";
                }, 250);
            }
        });
    }

    // ESC to close cart
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });
});

function handleNewsletter(event) {
    event.preventDefault();
    showToast("Thanks for subscribing! We'll keep you updated.");
    event.target.reset();
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

// ARTIST MODAL FUNCTIONS
function openArtistModal(card) {
    const name = card.dataset.name;
    const years = card.dataset.years;
    const nickname = card.dataset.nickname;
    const origin = card.dataset.origin;
    const song = card.dataset.song;
    const legacy = card.dataset.legacy;
    const bio = card.dataset.bio;
    const quote = card.dataset.quote;
    const image = card.dataset.image;

    document.getElementById('modalImage').src = image;
    document.getElementById('modalName').textContent = name.toUpperCase();
    document.getElementById('modalYears').textContent = years;
    document.getElementById('modalNickname').textContent = nickname;
    document.getElementById('modalOrigin').textContent = origin;
    document.getElementById('modalSong').textContent = song;
    document.getElementById('modalLegacy').textContent = legacy;
    document.getElementById('modalBio').textContent = bio;
    document.getElementById('modalQuote').textContent = `"${quote}"`;

    document.getElementById('artistModalOverlay').classList.add('active');
}

function closeArtistModal() {
    document.getElementById('artistModalOverlay').classList.remove('active');
}

// Close modal on overlay click
document.getElementById('artistModalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('artistModalOverlay')) {
        closeArtistModal();
    }
});

function addPosterToCartFromModal() {
    const name = document.getElementById('modalName').textContent;
    addPosterToCart('Poster', 150, document.getElementById('modalAddBtn'));
}