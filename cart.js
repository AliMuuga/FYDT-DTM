
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let selectedColor = "Black";
let selectedSize = "M";

/* ================= CART OPEN / CLOSE ================= */
function toggleCart() {
  document.getElementById("cartDrawer").classList.add("active");
  document.getElementById("cartOverlay").classList.add("active");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("active");
  document.getElementById("cartOverlay").classList.remove("active");
}

/* ESC CLOSE */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

/* ================= CART ADD ================= */
function addToCart(item) {
  cart.push(item);
  saveCart();
  loadCart();
}

/* ================= PRODUCT CARD ================= */
document.querySelectorAll(".product-card").forEach(card => {

  card.addEventListener("click", () => {
    openSheet(
      card.dataset.img,
      card.dataset.name,
      card.dataset.price
    );
  });

  card.querySelector(".cart-overlay").addEventListener("click", (e) => {
    e.stopPropagation();

    addToCart({
      name: card.dataset.name,
      price: card.dataset.price,
      color: "Black",
      size: "M"
    });
  });
});

/* ================= PRODUCT SHEET ================= */
function openSheet(img, name, price) {
  const sheet = document.getElementById("productSheet");

  document.getElementById("sheetImg").src = img;
  document.getElementById("sheetName").innerText = name;
  document.getElementById("sheetPrice").innerText = "R" + price;

  sheet.dataset.name = name;
  sheet.dataset.price = price;

  sheet.classList.add("active");
}

function closeSheet() {
  document.getElementById("productSheet").classList.remove("active");
}

/* OPTIONS FIX */
function selectColor(color, btn) {
  selectedColor = color;
}

function selectSize(size) {
  selectedSize = size;
}

/* ================= ADD FROM SHEET ================= */
function addFromSheet() {
  const sheet = document.getElementById("productSheet");

  addToCart({
    name: sheet.dataset.name,
    price: sheet.dataset.price,
    color: selectedColor,
    size: selectedSize
  });

  closeSheet();
}

/* ================= CART UI ================= */
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
        <strong>${item.name}</strong><br>
        ${item.color} / ${item.size}<br>
        R${item.price}
        <br>
        <button onclick="removeItem(${i})">Remove</button>
      </div>
    `;
  });

  totalEl.innerText = "Total: R" + total;
}

function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
  loadCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= PAYFAST READY ================= */
function payNow() {
  alert("PayFast integration ready — backend required");
}

loadCart();