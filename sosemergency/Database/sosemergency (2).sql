-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2025 at 03:25 AM
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
-- Table structure for table `alerts`
--

CREATE TABLE `alerts` (
  `id` int(11) NOT NULL,
  `alert_type` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `time` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alerts`
--

INSERT INTO `alerts` (`id`, `alert_type`, `location`, `status`, `time`, `created_at`, `updated_at`) VALUES
(4, 'Fire', 'Building B', 'Active', '09:08 AM', '2025-05-09 01:08:07', '2025-05-09 01:08:07'),
(5, 'Rescue', 'Building A', 'Active', '09:16 AM', '2025-05-09 01:16:37', '2025-05-09 01:16:37');

-- --------------------------------------------------------

--
-- Table structure for table `deployments`
--

CREATE TABLE `deployments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('Active','Completed','Cancelled') DEFAULT 'Active',
  `location` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deployments`
--

INSERT INTO `deployments` (`id`, `name`, `status`, `location`, `start_time`, `created_at`) VALUES
(3, 'Fire Rescue Operation', 'Active', 'Building 3, Floor 4', '2025-05-09 01:15:00', '2025-05-09 01:16:09');

-- --------------------------------------------------------

--
-- Table structure for table `incidents`
--

CREATE TABLE `incidents` (
  `id` int(11) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` enum('Active','Resolved') DEFAULT 'Active',
  `reported_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `incidents`
--

INSERT INTO `incidents` (`id`, `type`, `location`, `status`, `reported_at`) VALUES
(1, 'Fire', 'Warehouse A', 'Resolved', '2025-05-04 16:30:00'),
(2, 'Accident', 'Highway 23', 'Active', '2025-05-07 12:45:00'),
(3, 'Medical Emergency', 'Hall B', 'Active', '2025-05-06 09:10:00');

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
(10, 28, '2025-04-07 09:52:44'),
(11, 28, '2025-04-20 17:54:59'),
(12, 28, '2025-04-20 18:33:54'),
(13, 28, '2025-04-20 18:51:59'),
(14, 28, '2025-04-20 19:03:17'),
(15, 28, '2025-04-20 19:13:46'),
(16, 28, '2025-04-20 19:29:37'),
(17, 28, '2025-04-20 20:06:15'),
(18, 28, '2025-04-20 21:31:46'),
(19, 28, '2025-04-20 21:44:29'),
(20, 28, '2025-04-20 22:08:02'),
(21, 28, '2025-04-20 22:22:07'),
(22, 28, '2025-04-20 22:33:54'),
(23, 28, '2025-04-20 22:44:26'),
(24, 28, '2025-04-20 23:05:47'),
(25, 28, '2025-04-20 23:14:47'),
(26, 28, '2025-04-20 23:15:44'),
(27, 28, '2025-04-20 23:59:45'),
(28, 28, '2025-04-21 00:09:54'),
(29, 28, '2025-04-21 00:30:01'),
(30, 28, '2025-04-21 00:32:59'),
(31, 28, '2025-04-21 00:46:14'),
(32, 28, '2025-05-07 21:42:14'),
(33, 28, '2025-05-07 22:05:20'),
(34, 28, '2025-05-08 11:17:47'),
(35, 28, '2025-05-08 11:29:20'),
(36, 28, '2025-05-08 11:42:07'),
(37, 28, '2025-05-08 11:58:32'),
(38, 28, '2025-05-08 12:36:59'),
(39, 28, '2025-05-08 12:51:55'),
(40, 28, '2025-05-08 21:56:59'),
(41, 28, '2025-05-09 02:17:16'),
(42, 28, '2025-05-09 02:28:21'),
(43, 28, '2025-05-09 08:53:06'),
(44, 28, '2025-05-09 08:57:46'),
(45, 28, '2025-05-09 09:02:43');

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
(28, 'qq', 'qq', '09167163666', '$2b$10$owZTwIGsskwiExnI8Z2Rlu2dohT7g7UP9ZYY7WfXL.7CIzWdoTNHu', '2000-01-29', 'super_admin', 0, '2025-04-07 00:23:17', '2025-05-09 00:57:16'),
(29, 'qqqqqq', 'qqqqqqqqqq', '09171234567', '$2b$10$5NmfTOx0edQ0qoVmNhbPAeWV696oi6U02JvKvVToBY1oZuUcI78v2', '2000-12-31', '', 0, '2025-04-07 00:23:17', '2025-05-09 01:00:12'),
(30, 'qqqq', 'qqq', '09056782345', '$2b$10$5t9.k.TGgSrlJDVsll4J4ODq/Ia2akJkOGYbSQUTibD36/VT.XGbO', '2005-01-08', 'user', 0, '2025-04-07 00:23:17', '2025-05-09 01:00:33'),
(38, 'qwe', 'qwe', '11111111334', '$2b$10$tymjYtvc1kVJjt4kCogb4ey4SGqsHexBQ//or.SidEjislU2UfkBS', '0000-00-00', 'user', 0, '2025-04-07 00:23:17', '2025-04-07 01:26:04'),
(39, 'qqq', 'qqqqq', '22222222222', '$2b$10$JNkFZL8FTXxgYleuVCgwlOM7u1OrPE3LoB1WBVcvfGGxIo9b15dQ.', '0000-00-00', 'user', 0, '2025-04-07 00:23:17', '2025-04-07 01:26:04'),
(40, 'wwww', 'wwww', '33333333333', '$2b$10$fuLhnjAZjxb64.7.cVOrMeyb22Rb4HeES0VgmFT1kUKphYop0.FF.', '0000-00-00', 'user', 0, '2025-04-07 00:23:17', '2025-04-07 01:26:04'),
(41, 'qweqe', 'qweqweq', '11122222222', '$2b$10$fH/gvdP0r.BtNdL/VcSeH.8gf7UvdwRI.h3VIws0hSPCoH5W7bh9u', '0000-00-00', 'user', 0, '2025-04-07 00:23:17', '2025-04-07 01:26:04');

-- --------------------------------------------------------

--
-- Table structure for table `user_activity`
--

CREATE TABLE `user_activity` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('admin','user','coordinator') NOT NULL,
  `last_login` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_activity`
--

INSERT INTO `user_activity` (`id`, `name`, `role`, `last_login`, `created_at`) VALUES
(1, 'John Doe', 'admin', '2025-05-08 14:25:32', '2023-01-15 09:45:12'),
(2, 'Jane Smith', 'user', '2025-05-09 08:11:45', '2024-08-22 12:22:10'),
(3, 'Michael Brown', 'coordinator', '2025-05-07 19:45:01', '2022-11-30 16:30:56'),
(4, 'Alice Johnson', 'user', '2025-05-06 10:25:11', '2023-03-11 11:50:08'),
(5, 'Bob Harris', 'admin', '2025-05-05 15:55:42', '2022-10-18 08:12:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deployments`
--
ALTER TABLE `deployments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `user_activity`
--
ALTER TABLE `user_activity`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `deployments`
--
ALTER TABLE `deployments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `logins`
--
ALTER TABLE `logins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_logs`
--
ALTER TABLE `login_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

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
-- AUTO_INCREMENT for table `user_activity`
--
ALTER TABLE `user_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
