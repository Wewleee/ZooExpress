const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// База данных в памяти для простоты
const orders = [];

// API: Получение каталога товаров
app.get('/api/products', (req, res) => {
  const products = [
    { id: 1, name: 'Корм для собак ProPlan (Премиум)', pricePerKg: 2500, weights: [5, 10, 15, 20], category: 'Собаки' },
    { id: 2, name: 'Корм для кошек Royal Canin', pricePerKg: 3000, weights: [2, 5, 10], category: 'Кошки' },
    { id: 3, name: 'Наполнитель для туалета древесный', pricePerKg: 800, weights: [5, 10, 15], category: 'Кошки' },
    { id: 4, name: 'Витаминный комплекс для крупных пород', pricePerKg: 12000, weights: [1], category: 'Собаки' }
  ];
  res.json(products);
});

// API: Оформление заказа и отправка 3 Email-уведомлений
app.post('/api/orders', (req, res) => {
  const { customerName, email, phone, address, items, totalWeight } = req.body;

  if (!email || !items || items.length === 0) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' });
  }

  // Расчет доставки: базовый тариф + за вес
  const deliveryFee = 1000 + (totalWeight * 100); 
  const itemsTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const grandTotal = itemsTotal + deliveryFee;

  const newOrder = {
    id: `ORD-${Date.now().toString().slice(-5)}`,
    customerName,
    email,
    phone,
    address,
    items,
    totalWeight,
    deliveryFee,
    grandTotal,
    status: 'Принят',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  // Имитация триггерных Email-уведомлений (для 4-го пункта лабы)
  const emailLog = [
    {
      type: 'EMAIL_1_CONFIRMATION',
      to: email,
      subject: `Заказ ${newOrder.id} confirmed!`,
      body: `Здравствуйте, ${customerName}! Ваш заказ на сумму ${grandTotal} ₸ принят. Общий вес: ${totalWeight} кг.`
    },
    {
      type: 'EMAIL_2_COURIER_ASSIGNED',
      to: email,
      subject: `Курьер выехал по заказу ${newOrder.id}`,
      body: `Курьер забрал тяжелый груз (${totalWeight} кг) и направится по адресу: ${address}.`
    },
    {
      type: 'EMAIL_3_DELIVERY_SUCCESS',
      to: email,
      subject: `Заказ ${newOrder.id} доставлен`,
      body: `Спасибо за покупку в ЗооЭкспресс! Оцените работу курьера.`
    }
  ];

  console.log('--- ОТПРАВКА СИСТЕМНЫХ EMAIL-УВЕДОМЛЕНИЙ ---');
  console.log(emailLog);

  res.status(201).json({
    message: 'Заказ успешно создан!',
    order: newOrder,
    emailTriggers: emailLog
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});