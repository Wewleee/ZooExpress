-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL
);

-- Таблица товаров
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price_per_kg DECIMAL(10, 2) NOT NULL
);

-- Таблица заказов
CREATE TABLE orders (
    id VARCHAR(20) PRIMARY KEY,
    user_email VARCHAR(100) REFERENCES users(email),
    address TEXT NOT NULL,
    total_weight DECIMAL(5, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    grand_total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Принят',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);