CREATE DATABASE nizamvarietiesstore;


CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE staffs (
    staff_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(300) NOT NULL,
    password_otp VARCHAR(100) DEFAULT null,
    otp_expires_at DATE DEFAULT NULL,
    role VARCHAR(50) DEFAULT 'staff', 
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE brands (
    brand_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,

    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,

    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE,
    description TEXT,
    barcode VARCHAR(100) UNIQUE;
    brand_id INT REFERENCES brands(brand_id)

    purchase_price NUMERIC(10,2) NOT NULL,
    sale_price NUMERIC(10,2) NOT NULL,
    discount_price NUMERIC(10,2) DEFAULT 0,

    wholesale_price NUMERIC(10,2) NOT NULL,
    dealer_price NUMERIC(10,2) DEFAULT 0,
    retail_price NUMERIC(10,2) DEFAULT 0,

    image VARCHAR(500) NOT NULL,
    image_id VARCHAR(100) NOT NULL,

    stock INT DEFAULT 1 CHECK (stock >= 0),

    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,

    customer_id INT REFERENCES customers(customer_id),
    phone VARCHAR(20) NOT NULL,

    status VARCHAR(30) DEFAULT 'pending',

    subtotal_amount NUMERIC(10,2) NOT NULL,
    total_discount_amount NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL,

    created_by INT REFERENCES staff_users(staff_id), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(10,2) NOT NULL
);


CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,

    payment_method VARCHAR(50),
    amount NUMERIC(10,2) NOT NULL,

    payment_status VARCHAR(30) DEFAULT 'pending',
    transaction_id VARCHAR(100),

    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
