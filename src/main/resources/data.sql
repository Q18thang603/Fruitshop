INSERT INTO roles (id, name) VALUES (1, 'ADMIN'), (2, 'USER');
INSERT INTO category (id, name) VALUES (1, 'Trái cây'), (2, 'Rau củ'), (3, 'Đồ uống');
INSERT INTO users (id, username, password, email, phone, enabled, created_at, role_id) VALUES
  (1, 'demo', '123456', 'demo@example.com', '0123456789', 1, NOW(), 2);
INSERT INTO carts (id, user_id) VALUES (1, 1);
INSERT INTO product (id, name, price, quantity, image, description, category_id) VALUES
  (1, 'Táo đỏ', 1.50, 50, 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg', 'Táo đỏ tươi ngon, ngọt mát.', 1),
  (2, 'Chuối vàng', 1.00, 40, 'https://images.pexels.com/photos/111131/pexels-photo-111131.jpeg', 'Chuối chín vàng, giàu dinh dưỡng.', 1),
  (3, 'Cà rốt', 0.90, 80, 'https://images.pexels.com/photos/8390/food-healthy-vegetables.jpg', 'Cà rốt tươi, giòn và sạch.', 2),
  (4, 'Cam tươi', 1.80, 60, 'https://images.pexels.com/photos/42059/oranges-fruit-vitamins-healthy-42059.jpeg', 'Cam tươi giàu vitamin C.', 1);
