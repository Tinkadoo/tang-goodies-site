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

  
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();

  const form = document.getElementById('contact-form');
  const sendBtn = document.getElementById('send-button');
  const thankYouMsg = document.getElementById('thank-you-message');

  if (form && sendBtn && thankYouMsg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      fetch("https://formsubmit.co/57c9d1f17018a7ef4c41876a3b269243sub", {
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
});
