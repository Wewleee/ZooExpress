const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// Инициализация Gemini API (ключ берется из переменных окружения сервера)
const ai = new GoogleGenAI();

// Роут для ИИ-ветеринара
app.post('/api/ai-consultant', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Сообщение не передано' });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: `Ты профессиональный ветеринар и консультант зоомагазина "ZooExpress". Отвечай коротко, заботливо и профессионально на вопросы о домашних животных, их питании, уходе и подборе зоотоваров. Вопрос клиента: ${message}` }]
                }
            ]
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error('Ошибка ИИ:', error);
        res.status(500).json({ error: 'Не удалось получить ответ от ИИ-консультанта' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
