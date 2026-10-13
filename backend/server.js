const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI();
const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

// --- РОУТ ДЛЯ ОФОРМЛЕНИЯ ЗАКАЗА (возвращаем name, phone, email) ---
app.post('/api/orders', (req, res) => {
    try {
        const { name, phone, email, items, totalWeight, totalCost, deliveryType } = req.body;
        
        if (!name || !phone || !items) {
            return res.status(400).json({ success: false, error: 'Заполните обязательные поля (имя, телефон)' });
        }

        console.log(`Получен новый заказ от ${name} (${phone}, ${email}):`, {
            items, totalWeight, totalCost, deliveryType
        });

        // Здесь можно добавить сохранение в базу данных PostgreSQL, если требуется

        res.json({ 
            success: true, 
            message: 'Заказ успешно оформлен!',
            orderInfo: { name, phone, email, totalCost, deliveryType }
        });
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        res.status(500).json({ success: false, error: 'Ошибка сервера при оформлении заказа' });
    }
});

// --- РОУТ ДЛЯ ИИ-ВЕТЕРИНАРА ---
app.post('/api/ai-consultant', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Сообщение не передано' });
        }

        let responseText = null;
        let lastError = null;

        for (const modelName of MODELS_TO_TRY) {
            try {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: `Ты профессиональный ветеринар и консультант зоомагазина "ZooExpress". Отвечай коротко, заботливо и профессионально на вопросы о домашних животных, их питании, уходе и подборе зоотоваров. Вопрос клиента: ${message}` }]
                        }
                    ]
                });
                responseText = response.text;
                if (responseText) break;
            } catch (err) {
                console.warn(`Модель ${modelName} недоступна, пробуем следующую...`);
                lastError = err;
            }
        }

        if (!responseText) {
            throw lastError || new Error('Все модели недоступны');
        }

        res.json({ reply: responseText });
    } catch (error) {
        console.error('Ошибка ИИ:', error);
        res.status(500).json({ error: 'Не удалось получить ответ от ИИ-консультанта' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
