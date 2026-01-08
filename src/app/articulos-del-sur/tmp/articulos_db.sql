-- phpMyAdmin SQL Dump
-- version 5.2.3-1.el10_1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 06-01-2026 a las 23:59:00
-- Versión del servidor: 10.11.11-MariaDB
-- Versión de PHP: 8.3.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `articulos_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(10, 'Aires Split'),
(2, 'Celulares'),
(7, 'Cocinas'),
(6, 'Heladeras'),
(5, 'Lavado'),
(8, 'Notebooks'),
(9, 'Otros'),
(4, 'Parlantes'),
(1, 'Televisores'),
(3, 'Ventiladores');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','shipped','cancelled') DEFAULT 'pending',
  `payment_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `payment_id`, `created_at`) VALUES
(1, 2, 400000.00, 'pending', NULL, '2025-12-04 14:29:15'),
(2, 2, 400000.00, 'paid', NULL, '2025-12-04 14:41:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 4, 1, 400000.00),
(2, 2, 4, 1, 400000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `is_featured` tinyint(1) DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `discount_percentage` int(11) DEFAULT 0,
  `is_offer` tinyint(1) DEFAULT 0,
  `offer_expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image_url`, `stock`, `created_at`, `is_featured`, `category_id`, `discount_percentage`, `is_offer`, `offer_expires_at`) VALUES
(1, 'Ventilador Liliana 25 Pulgadas', 'Ventilador de pie Marca Liliana 25 pulgadas', 156000.00, 'image/products/693040acf3840.jpeg', 13, '2025-12-03 13:26:48', 1, 3, 0, 0, NULL),
(2, 'Ventilador Axel 24 Pulgadas', 'Ventilador Axel 24 Pulgadas', 138000.00, 'image/products/693040a4150e6.jpeg', 10, '2025-12-03 13:33:51', 1, 3, 0, 0, NULL),
(3, 'HELADERA CON FREEZER SAMSUNG RT38CG6720S9B3 INOXIDABLE', 'HELADERA CON FREEZER SAMSUNG RT38CG6720S9B3 INOXIDABLE', 999000.00, 'image/products/6930447ecc105.jpeg', 14, '2025-12-03 14:09:02', 1, 6, 0, 0, NULL),
(4, 'SMART LED TV SAMSUNG 43\" PULGADAS FULL HD UN43F6000FGCZB', 'SMART LED TV SAMSUNG 43\" PULGADAS FULL HD UN43F6000FGCZB', 400000.00, 'image/products/69304537c36c1.jpeg', 12, '2025-12-03 14:12:07', 1, 1, 0, 0, NULL),
(5, 'Aire acondicionado RCA 5700W split frio calor Inverter', 'Aire acondicionado RCA RT5700INV 4902F 5700W split frio calor Inverter', 1354499.00, 'image/products/69383f3dad523.webp', 10, '2025-12-09 15:24:45', 1, 10, 10, 1, NULL),
(6, 'Parlante Noblex', 'Parlante Noblex, Full Sound 3D', 89000.00, 'image/products/012e8164-bbc8-4a81-9a6d-6484ffe5dfe4.webp', 5, '2025-12-29 13:40:01', 1, 4, 15, 1, '2026-01-07 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_payment_plans`
--

CREATE TABLE `product_payment_plans` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `plan_type` enum('plan1','plan2','plan3','plan4') NOT NULL,
  `initial_payment` decimal(10,2) DEFAULT 0.00,
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `product_payment_plans`
--

INSERT INTO `product_payment_plans` (`id`, `product_id`, `plan_type`, `initial_payment`, `details`) VALUES
(3, 5, 'plan1', 466320.00, NULL),
(4, 5, 'plan2', 349740.00, NULL),
(5, 5, 'plan3', 0.00, NULL),
(6, 4, 'plan1', 100000.00, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('in','out') NOT NULL,
  `quantity` int(11) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `product_id`, `user_id`, `type`, `quantity`, `reason`, `created_at`) VALUES
(1, 3, 1, 'in', 4, 'compra a proveedor', '2025-12-04 14:08:02'),
(2, 1, 1, 'in', 3, 'compra a proveedor', '2025-12-04 14:08:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','client','seller','consultant') DEFAULT 'client',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `phone`, `address`, `city`, `province`, `zip_code`) VALUES
(1, 'Admin', 'admin@articulosdelsur.com', '$2b$10$kxcrB7cALdXM7eY9rq27n.1TOjuES.qmWhUN/gKvkxpHTTjKWidUu', 'admin', '2025-12-03 12:35:12', NULL, NULL, NULL, NULL, NULL),
(2, 'Claudio Alejandro Lex', 'lexclaudio@gmail.com', '$2y$10$1QV2GOt5mmcLUCYYcNfhi.u16i2qiMj2EHwVO18SF1blE2KCAQJdm', 'client', '2025-12-04 14:28:50', '3764240186', 'San Juan 3472', 'Posadas', 'Misiones', '3300');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_category` (`category_id`);

--
-- Indices de la tabla `product_payment_plans`
--
ALTER TABLE `product_payment_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `product_payment_plans`
--
ALTER TABLE `product_payment_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Filtros para la tabla `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `product_payment_plans`
--
ALTER TABLE `product_payment_plans`
  ADD CONSTRAINT `product_payment_plans_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `stock_movements_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
