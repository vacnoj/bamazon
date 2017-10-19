CREATE TABLE `products` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `stock_quantity` int(30) NOT NULL,
  PRIMARY KEY (`id`)
);

