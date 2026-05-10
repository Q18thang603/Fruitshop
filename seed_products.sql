-- Seed script: real ecommerce products with Cloudinary secure_url images
-- Cloud name: dhtrcj8yk

-- Clear existing products
DELETE FROM products;

-- Reset auto_increment
ALTER TABLE products AUTO_INCREMENT = 1;

-- Insert 12 real products mapped to Cloudinary images
INSERT INTO products (name, price, quantity, image, description, category) VALUES

-- FRUITS
('Chuối Sạch', 25000, 150,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/06_bmhz0b.jpg',
 'Chuối sạch trồng theo phương pháp hữu cơ, không thuốc trừ sâu. Giàu kali, tốt cho tim mạch và hệ tiêu hóa.',
 'fruit'),

('Cam Hữu Cơ', 45000, 120,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/09_j2agcb.jpg',
 'Cam tươi hữu cơ từ vườn Đà Lạt, vị ngọt tự nhiên, giàu vitamin C, tăng cường miễn dịch.',
 'fruit'),

('Bơ Sạch Đà Lạt', 55000, 80,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/08_fgbl70.jpg',
 'Bơ sạch Đà Lạt loại 1, béo ngậy tự nhiên. Giàu chất béo lành mạnh, vitamin E và khoáng chất.',
 'fruit'),

('Ổi Tươi', 30000, 100,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/%e1%bb%95i_rwtufn.jpg',
 'Ổi tươi ngọt, giàu vitamin C và chất xơ. Thu hoạch ngay từ vườn, đảm bảo độ tươi ngon.',
 'fruit'),

-- VEGETABLES
('Bông Cải Xanh', 35000, 90,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/12_qjr34x.jpg',
 'Bông cải xanh (broccoli) hữu cơ, giàu vitamin K, C và chất chống oxy hóa. Tốt cho sức khỏe xương và miễn dịch.',
 'vegetable'),

('Bắp Cải Tươi', 20000, 200,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/11_dkyab8.jpg',
 'Bắp cải trắng tươi ngon, giàu vitamin C và chất xơ. Thích hợp cho các món salad và xào.',
 'vegetable'),

('Bắp Cải Tím', 28000, 70,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/02_borlta.jpg',
 'Bắp cải tím hữu cơ, giàu anthocyanin chống oxy hóa. Màu sắc đẹp, phù hợp trang trí món ăn.',
 'vegetable'),

('Cà Rốt Sạch', 22000, 160,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/03_t6efex.jpg',
 'Cà rốt sạch đất đỏ Lâm Đồng, giàu beta-carotene và vitamin A. Tốt cho mắt và hệ miễn dịch.',
 'vegetable'),

('Đậu Cô Ve', 32000, 85,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/13_etzolp.jpg',
 'Đậu cô ve tươi non, giàu protein thực vật và chất xơ. Không dùng thuốc tăng trưởng.',
 'vegetable'),

('Khoai Lang Mật', 18000, 180,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/16_szjr5s.jpg',
 'Khoai lang mật ngọt tự nhiên, giàu vitamin B6 và chất chống oxy hóa. Phù hợp ăn kiêng và tập thể thao.',
 'vegetable'),

-- MEAT
('Thịt Bò Hữu Cơ', 280000, 40,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/04_gdgi6n.jpg',
 'Thịt bò hữu cơ loại đặc biệt, không hormone tăng trưởng. Thịt mềm, thơm ngon, giàu protein và sắt.',
 'meat'),

-- DAIRY & ORGANIC
('Trứng Gà Sạch', 35000, 300,
 'https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/18_xmvgda.jpg',
 'Trứng gà ta sạch từ trang trại hữu cơ, gà nuôi thả vườn. Lòng đỏ đậm, giàu dinh dưỡng.',
 'organic');
