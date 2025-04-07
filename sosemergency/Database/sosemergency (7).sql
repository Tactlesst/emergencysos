-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 07, 2025 at 03:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sosemergency`
--

-- --------------------------------------------------------

--
-- Table structure for table `logins`
--

CREATE TABLE `logins` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_time` datetime NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_logs`
--

CREATE TABLE `login_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login_logs`
--

INSERT INTO `login_logs` (`id`, `user_id`, `login_time`) VALUES
(1, 28, '2025-04-07 00:38:03'),
(2, 39, '2025-04-07 00:39:39'),
(3, 39, '2025-04-07 01:01:07'),
(4, 28, '2025-04-07 01:01:23'),
(5, 28, '2025-04-07 01:12:09'),
(6, 28, '2025-04-07 08:53:29'),
(7, 28, '2025-04-07 09:17:51'),
(8, 28, '2025-04-07 09:29:00'),
(9, 28, '2025-04-07 09:42:13'),
(10, 28, '2025-04-07 09:52:44');

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

CREATE TABLE `stations` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `staffCount` int(11) DEFAULT 0,
  `activeOperations` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` date DEFAULT NULL,
  `userType` enum('station','super_admin','user') NOT NULL DEFAULT 'user',
  `disabled` tinyint(1) NOT NULL DEFAULT 0,
  `dateCreated` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `phone`, `password`, `dob`, `userType`, `disabled`, `dateCreated`, `updated_at`) VALUES
(28, 'qq', 'qq', '11111111111', '$2b$10$owZTwIGsskwiExnI8Z2Rlu2dohT7g7UP9ZYY7WfXL.7CIzWdoTNHu', '2000-01-29', 'super_admin', 0, '2025-04-07 00:23:17', '2025-04-07 01:26:04'),
(29, 'qqqqqq', 'qqqqqqqqqq', '11111111112', '$2b$10$5NmfTOx0edQ0qoVmNhbPAeWV696oi6U02JvKvVToBY1oZuUcI78v2', '2000-12-31', '', 0, '2025-04-07 00:23:17', '2025-04-07 01:26:04'),
(30, 'qqqq', 'qqq', '11111111333', '$2b$10$5t9.k.TGgSrlJDVsll4J4ODq/Ia2akJkOGYbSQUTibD36/VT.XGbO', '2005-01-08', 'user', 0, '2025-04-07 00:23:17', '2025-04-07 01:26:04'),
(38, 'qwe', 'qwe', '11111111334', '$2b$10$tymjYtvc1kVJjt4kCogb4ey4SGqsHexBQ//or.SidEjislU2UfkBS', '0000-00-00', 'user', 0, '2025-04-07 00:23:17', '2025-04-07 01:26:04'),
(39, 'qqq', 'qqqqq', '22222222222', '$2b$10$JNkFZL8FTXxgYleuVCgwlOM7u1OrPE3LoB1WBVcvfGGxIo9b15dQ.', '0000-00-00', 'user', 0, '2025-04-07 00:23:17', '2025-04-07 01:26:04'),
(40, 'wwww', 'wwww', '33333333333', '$2b$10$fuLhnjAZjxb64.7.cVOrMeyb22Rb4HeES0VgmFT1kUKphYop0.FF.', '0000-00-00', 'user', 0, '2025-04-07 00:23:17', '2025-04-07 01:26:04'),
(41, 'qweqe', 'qweqweq', '11122222222', '$2b$10$fH/gvdP0r.BtNdL/VcSeH.8gf7UvdwRI.h3VIws0hSPCoH5W7bh9u', '0000-00-00', 'user', 0, '2025-04-07 00:23:17', '2025-04-07 01:26:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `logins`
--
ALTER TABLE `logins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_logs`
--
ALTER TABLE `login_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `stations`
--
ALTER TABLE `stations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `logins`
--
ALTER TABLE `logins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_logs`
--
ALTER TABLE `login_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `stations`
--
ALTER TABLE `stations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `login_logs`
--
ALTER TABLE `login_logs`
  ADD CONSTRAINT `login_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stations`
--
ALTER TABLE `stations`
  ADD CONSTRAINT `stations_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
