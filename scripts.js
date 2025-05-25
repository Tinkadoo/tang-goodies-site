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
  const cartCountElem = document.getElementById('cart-count');
  if (cartCountElem) {
    cartCountElem.textContent = count;
  }
}
  
function addToCart(name, price, containerId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  // Replace the button with "In Cart" text
  const container = document.getElementById(containerId);
  container.innerHTML = `<div class="text-black font-semibold mt-4 text-sm">In cart</div>`;

  // Update shopping cart
  updateCartCount();
}
  