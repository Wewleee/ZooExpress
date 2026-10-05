const API_URL = 'http://localhost:3000/api';
let cart = [];

// Загрузка товаров с сервера
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    renderCatalog(products);
  } catch (e) {
    console.error('Ошибка загрузки каталога:', e);
  }
}

function renderCatalog(products) {
  const container = document.getElementById('product-list');
  container.innerHTML = products.map(p => `
    <div class="card">
      <div>
        <small>${p.category}</small>
        <h3>${p.name}</h3>
        <p>Цена: ${p.pricePerKg} ₸ / кг</p>
        <label>Выберите вес:</label>
        <select id="weight-${p.id}">
          ${p.weights.map(w => `<option value="${w}">${w} кг (${w * p.pricePerKg} ₸)</option>`).join('')}
        </select>
      </div>
      <button onclick="addToCart(${p.id}, '${p.name}', ${p.pricePerKg})">В корзину</button>
    </div>
  `).join('');
}

function addToCart(id, name, pricePerKg) {
  const weightSelect = document.getElementById(`weight-${id}`);
  const weight = parseInt(weightSelect.value);
  const totalPrice = weight * pricePerKg;

  cart.push({ id, name, weight, pricePerKg, totalPrice });
  updateCartUI();
}

function updateCartUI() {
  const cartContainer = document.getElementById('cart-items');
  const submitBtn = document.getElementById('submit-btn');

  if (cart.length === 0) {
    cartContainer.innerHTML = 'Корзина пуста';
    submitBtn.disabled = true;
    return;
  }

  cartContainer.innerHTML = cart.map((item, index) => `
    <div style="margin-bottom: 0.5rem; font-size: 0.9rem;">
      <strong>${item.name}</strong><br>
      ${item.weight} кг × ${item.pricePerKg} ₸ = ${item.totalPrice} ₸
      <a href="#" onclick="removeFromCart(${index})" style="color:red; margin-left:5px;">[✕]</a>
    </div>
  `).join('');

  const totalWeight = cart.reduce((sum, i) => sum + i.weight, 0);
  const itemsTotal = cart.reduce((sum, i) => sum + i.totalPrice, 0);
  const deliveryFee = 1000 + (totalWeight * 100);
  const grandTotal = itemsTotal + deliveryFee;

  document.getElementById('total-weight').innerText = totalWeight;
  document.getElementById('delivery-fee').innerText = deliveryFee;
  document.getElementById('grand-total').innerText = grandTotal;

  submitBtn.disabled = false;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Отправка формы заказа
document.getElementById('order-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const totalWeight = cart.reduce((sum, i) => sum + i.weight, 0);
  const orderData = {
    customerName: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    items: cart,
    totalWeight
  };

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const result = await res.json();

    const resultBox = document.getElementById('order-result');
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
      <strong>Успешно! Номер заказа: ${result.order.id}</strong><br>
      Сгенерировано 3 Email-триггера (см. консоль сервера).
    `;

    cart = [];
    updateCartUI();
    e.target.reset();
  } catch (err) {
    alert('Ошибка при отправке заказа');
  }
});

loadProducts();