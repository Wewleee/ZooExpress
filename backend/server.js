const express = require('express');
const cors = require('cors');

const app = express();

// Настройки Middleware
app.use(cors());
app.use(express.json());

// Простая имитация базы данных в памяти для заказов
const ordersDatabase = [];

// ==========================================
// 1. МАРШРУТ: Оформление заказа (Order API)
// ==========================================
app.post('/api/orders', (req, res) => {
    try {
        const { name, phone, email, cart, totalPrice } = req.body;

        // Проверка обязательных полей
        if (!name || !phone) {
            return res.status(400).json({ 
                error: 'Пожалуйста, укажите имя и номер телефона.' 
            });
        }

        // Формируем объект заказа
        const newOrder = {
            id: Date.now(),
            name,
            phone,
            email: email || 'Не указан',
            cart: cart || [],
            totalPrice: totalPrice || 0,
            createdAt: new Date().toISOString()
        };

        // Сохраняем в "базу данных"
        ordersDatabase.push(newOrder);

        console.log('--- НОВЫЙ ЗАКАЗ ПОЛУЧЕН ---');
        console.log(`Имя: ${name}`);
        console.log(`Телефон: ${phone}`);
        console.log(`Email: ${email}`);
        console.log(`Заказ ID: ${newOrder.id}`);
        console.log('---------------------------');

        return res.status(201).json({
            message: 'Заказ успешно оформлен!',
            orderId: newOrder.id
        });
    } catch (error) {
        console.error('Ошибка при обработке заказа:', error);
        return res.status(500).json({ error: 'Ошибка сервера при оформлении заказа' });
    }
});

// ==========================================
// 2. МАРШРУТ: Фейковый ИИ-Консультант (AI API)
// ==========================================
app.post('/api/ai-consultant', (req, res) => {
    try {
        const { message } = req.body;
        const text = (message || '').toLowerCase();

        let reply = "";

        // Сценарий ответов по ключевым словам
        if (text.includes("корм") || text.includes("еда") || text.includes("посоветуй") || text.includes("кушать")) {
            reply = "Здравствуйте! Для кошек и собак рекомендуем линейку премиум-корма ZooExpress. Подскажите возраст и породу вашего питомца, чтобы подставить идеальный рацион?";
        } else if (text.includes("болит") || text.includes("врач") || text.includes("помощь") || text.includes("ветеринар") || text.includes("живот")) {
            reply = "Если ваш питомец чувствует себя плохо, настоятельно рекомендуем обратиться в ближайшую ветеринарную клинику! А для профилактики вы можете заказать у нас витаминные комплексы.";
        } else if (text.includes("доставка") || text.includes("заказ") || text.includes("оплата") || text.includes("скольку") || text.includes("стоид")) {
            reply = "Доставка осуществляется день в день при заказе до 18:00. При заказе от 5000 тенге — доставка бесплатно!";
        } else if (text.includes("привет") || text.includes("здравствуй") || text.includes("хай") || text.includes("добрый")) {
            reply = "Приветствую! Я виртуальный ветеринарный консультант ZooExpress. Чем могу помочь вам и вашему питомцу сегодня?";
        } else {
            reply = "Спасибо за ваш вопрос! Как ваш персональный ИИ-консультант ZooExpress, я рекомендую обратиться к нашему каталогу товаров или задать вопрос про корм и доставку!";
        }

        return res.json({ reply });
    } catch (error) {
        console.error('Ошибка в работе консультанта:', error);
        return res.status(500).json({ error: 'Не удалось получить ответ от консультанта' });
    }
});

// Запуск сервера на порту 3000 (со связкой 0.0.0.0 для корректной работы)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
