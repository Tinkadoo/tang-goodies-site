const STORAGE_KEY = "cart";
let cartData = loadCart();

const cartItemsContainer = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const zipInput = document.getElementById("zip");
const zipWarning = document.getElementById("zip-warning");
const checkoutBtn = document.getElementById("checkout-btn");
const emptyMessage = document.getElementById("empty-message");

function nextImage(button) {
    const slider = button.closest('.product-card').querySelectorAll('.slider-img');
    let currentIndex = Array.from(slider).findIndex(img => img.classList.contains('active'));
  
    // Remove 'active' from current
    slider[currentIndex].classList.remove('active');
  
    // Add 'active' to next (wrap around)
    const nextIndex = (currentIndex + 1) % slider.length;
    slider[nextIndex].classList.add('active');
  }
  
function prevImage(button) {
  const slider = button.closest('.product-card').querySelectorAll('.slider-img');
  let currentIndex = Array.from(slider).findIndex(img => img.classList.contains('active'));

  // Remove 'active' from current
  slider[currentIndex].classList.remove('active');

  // Add 'active' to previous (wrap around)
  const prevIndex = (currentIndex - 1 + slider.length) % slider.length;
  slider[prevIndex].classList.add('active');
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  const badge = document.getElementById('cart-count-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

  
function addToCart(name, price, imageUrl, containerId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, qty: 1, image: imageUrl });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  const container = document.getElementById(containerId);
  container.innerHTML = `<div class="text-black font-semibold mt-4 text-sm">In cart</div>`;
}


function loadCart() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}
      
function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cartData));
}
  
      
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cartData.length === 0) {
    emptyMessage.classList.remove("hidden");
    checkoutBtn.disabled = true;
    subtotalEl.textContent = "$0.00";
    return;
  } else {
    emptyMessage.classList.add("hidden");
  }

  cartData.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.className = "flex items-center justify-between border-b pb-2";

    const imageUrl = item.image || "https://cdn-icons-png.flaticon.com/512/2917/2917990.png";

    itemEl.innerHTML = `
      <div class="flex items-center space-x-4">
        <img src="${imageUrl}" alt="${item.name}" class="w-14 h-14 object-cover rounded">
        <div>
          <p class="font-semibold">${item.name}</p>
          <p class="text-sm text-gray-500">$${item.price.toFixed(2)} each</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button onclick="updateQuantity(${index}, -1)" class="px-2 bg-gray-200 rounded">−</button>
        <input type="number" value="${item.qty}" min="1" class="w-12 text-center border rounded" onchange="setQuantity(${index}, this.value)">
        <button onclick="updateQuantity(${index}, 1)" class="px-2 bg-gray-200 rounded">+</button>
        <button onclick="removeItem(${index})" class="ml-3 text-red-600">🗑️</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  updateSubtotal();
}
      
function updateSubtotal() {
  const subtotal = cartData.reduce((sum, item) => sum + item.price * item.qty, 0);
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  validateCheckout();
}
      
function updateQuantity(index, change) {
    if (!cartData[index]) return;
    cartData[index].qty = Math.max(1, cartData[index].qty + change);
    saveCart();
    renderCart();
    updateCartCount();
}
      
function setQuantity(index, value) {
    if (!cartData[index]) return;
    cartData[index].qty = Math.max(1, parseInt(value) || 1);
    saveCart();
    renderCart();
    updateCartCount();
}
      
function removeItem(index) {
    cartData.splice(index, 1);
    saveCart();
    renderCart();
    updateCartCount();
}
      
function validateCheckout() {
  const zip = zipInput.value.trim();
  const checkoutBtn = document.getElementById("checkout-btn");

  if (zip !== "77494" || cartData.length === 0) {
    zipWarning.classList.remove("hidden");
    checkoutBtn.classList.add("opacity-50", "pointer-events-none");
  } else {
    zipWarning.classList.add("hidden");
    checkoutBtn.classList.remove("opacity-50", "pointer-events-none");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  // Existing logic for cart and contact page
  updateCartCount();

  const form = document.getElementById('contact-form');
  const sendBtn = document.getElementById('send-button');
  const thankYouMsg = document.getElementById('thank-you-message');

  if (form && sendBtn && thankYouMsg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      fetch("https://formsubmit.co/57c9d1f17018a7ef4c41876a3b269243", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      })
        .then(response => {
          if (response.ok) {
            sendBtn.classList.add("hidden");
            thankYouMsg.classList.remove("hidden");
            form.reset();
          } else {
            sendBtn.innerText = "Something went wrong. Try again.";
          }
        })
        .catch(() => {
          sendBtn.innerText = "Submission failed. Try again.";
        });
    });
  }

  if (zipInput && cartItemsContainer) {
    zipInput.addEventListener("input", validateCheckout);
    renderCart();
  }

  // ✅ New: Checkout page logic
  const checkoutForm = document.getElementById("checkout-form");
  const orderDetails = document.getElementById("order-details");
  const confirmation = document.getElementById("order-confirmation");

  if (checkoutForm && orderDetails && confirmation) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (cart.length === 0) {
      window.location.href = "cart.html";
    }

    const summary = cart.map(item => `${item.name} x ${item.qty} @ $${item.price.toFixed(2)}`).join(", ");
    orderDetails.value = summary;

    checkoutForm.addEventListener("submit", () => {
      setTimeout(() => {
        localStorage.removeItem("cart");
        confirmation.classList.remove("hidden");
        checkoutForm.classList.add("hidden");
        updateCartCount();
      }, 500);
    });
  }
});

