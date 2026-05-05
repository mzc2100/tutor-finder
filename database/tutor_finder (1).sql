-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 05, 2026 at 10:32 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tutor_finder`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(2, 'Maid'),
(3, 'Room Rent'),
(4, 'Service'),
(1, 'Tutor');

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone_visibility` enum('show','request') DEFAULT 'show',
  `main_image` varchar(255) DEFAULT NULL,
  `rate_type` enum('month','day','service','negotiable') DEFAULT 'month'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `listings`
--

INSERT INTO `listings` (`id`, `title`, `description`, `category_id`, `price`, `location`, `phone`, `is_active`, `created_at`, `phone_visibility`, `main_image`, `rate_type`) VALUES
(1, 'Math Tutor for Class 8-10', 'Experienced teacher', 1, 3000.00, 'Dhaka', '017XXXXXXXX', 1, '2026-02-06 05:41:56', 'show', NULL, 'month'),
(2, 'English tutor for class 1-10', 'MSc BSc in English (CU), MSc BSc in English (CU), MSc BSc in English (CU),MSc BSc in English (CU)MSc BSc in English (CU)MSc BSc in English (CU)MSc BSc in English (CU)MSc BSc in English (CU)MSc BSc in English (CU)', 1, 123.00, 'Chittagong', '015488646844', 1, '2026-02-06 08:52:38', 'show', NULL, 'month'),
(3, 'Intermediate Science', 'Very Good CUET', 1, 3234.00, 'dhaka', '45648798794', 1, '2026-02-06 10:20:55', 'show', NULL, 'month'),
(4, 'Bengali Tutor', 'Very good lady tutor', 1, 456.00, 'dhaka', '78979846464', 1, '2026-02-06 10:21:12', 'request', NULL, 'month'),
(5, 'Chemistry Tutor', 'MSc in Chemistry', 1, 5000.00, 'Chittagong', '0456498444564', 1, '2026-02-06 16:51:12', 'show', NULL, 'month'),
(6, 'Plumber', 'Good Plumber', 4, 500.00, 'Chittagong', '01587894745', 1, '2026-02-20 05:40:51', 'show', NULL, 'month'),
(7, 'ঘরভাড়া দেয়া হইবে', 'আগে আসলে আগে পাবেন ভিত্তিতে', 3, 5000.00, 'বিশ্বকলোনী', '01626719163', 1, '2026-05-04 17:43:47', 'show', NULL, 'month'),
(8, 'ঘড় ভাড়া', 'House To Rent', 3, 500.00, 'Agrabad', '01525847897', 1, '2026-05-04 18:36:29', 'show', '1777919789163-451135707.png', 'month'),
(9, 'House Rent in Mogultuli', 'Good houses to rent', 3, 5000.00, 'Sugondha', '01254484565', 1, '2026-05-04 18:38:58', 'show', '1777919938875-180793113.png', 'month'),
(10, 'House Rent in Agrabad', '4 bed room house', 3, 50000.00, 'Agrabad', '01564884856', 1, '2026-05-04 18:47:33', 'request', '1777920453982-151864240.png', 'month');

-- --------------------------------------------------------

--
-- Table structure for table `listing_images`
--

CREATE TABLE `listing_images` (
  `id` int(11) NOT NULL,
  `listing_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `listing_images`
--

INSERT INTO `listing_images` (`id`, `listing_id`, `image_path`, `display_order`, `created_at`) VALUES
(1, 8, '1777919789163-451135707.png', 0, '2026-05-04 18:36:29'),
(2, 9, '1777919938875-180793113.png', 0, '2026-05-04 18:38:58'),
(3, 10, '1777920453982-151864240.png', 0, '2026-05-04 18:47:33'),
(4, 10, '1777920453983-730217305.png', 1, '2026-05-04 18:47:33'),
(5, 10, '1777920453986-740260974.png', 2, '2026-05-04 18:47:34'),
(6, 10, '1777920453987-295351303.png', 3, '2026-05-04 18:47:34'),
(7, 10, '1777920453989-524054460.png', 4, '2026-05-04 18:47:34'),
(8, 10, '1777920453990-668046165.png', 5, '2026-05-04 18:47:34'),
(9, 10, '1777920453990-820588946.png', 6, '2026-05-04 18:47:34');

-- --------------------------------------------------------

--
-- Table structure for table `phone_requests`
--

CREATE TABLE `phone_requests` (
  `id` int(11) NOT NULL,
  `listing_id` int(11) NOT NULL,
  `listing_title` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_phone` varchar(20) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phone_requests`
--

INSERT INTO `phone_requests` (`id`, `listing_id`, `listing_title`, `user_name`, `user_phone`, `description`, `created_at`) VALUES
(1, 4, 'asdf', 'Mashruf', '01564684', 'It is my interest', '2026-02-06 16:27:55'),
(2, 4, 'Bengali Tutor', 'Masum', '0145648979', 'I need a good teacher for my brother.', '2026-02-06 16:50:18'),
(3, 10, 'House Rent in Agrabad', 'mashruf', '0158448674', 'this looks very good to me', '2026-05-04 18:56:52');

-- --------------------------------------------------------

--
-- Table structure for table `provider_registrations`
--

CREATE TABLE `provider_registrations` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `nid_photo_path` varchar(255) DEFAULT NULL,
  `cv_path` varchar(255) DEFAULT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `other_notes` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provider_registrations`
--

INSERT INTO `provider_registrations` (`id`, `full_name`, `mobile_number`, `address`, `category`, `nid_photo_path`, `cv_path`, `reference_number`, `other_notes`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Mashruf', '45647897945', 'asdf asdf asdf asdfasdf', 'Tutor', '1771567627749-102326680.JPG', '1771567627790-137519907.pdf', '4564654', '465478897', 'approved', '2026-02-20 06:07:07', '2026-02-20 06:10:07'),
(2, 'Mashruf', '487998745464', 'Agrabad, Chittagong', 'Tutor', '1771568298852-363454150.JPG', '1771568298860-159321706.pdf', '45646478754', 'JLKJLKJ SLDKFJ', 'pending', '2026-02-20 06:18:18', '2026-02-20 06:18:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `listing_images`
--
ALTER TABLE `listing_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listing_id` (`listing_id`);

--
-- Indexes for table `phone_requests`
--
ALTER TABLE `phone_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listing_id` (`listing_id`);

--
-- Indexes for table `provider_registrations`
--
ALTER TABLE `provider_registrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `listings`
--
ALTER TABLE `listings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `listing_images`
--
ALTER TABLE `listing_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `phone_requests`
--
ALTER TABLE `phone_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `provider_registrations`
--
ALTER TABLE `provider_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `listings`
--
ALTER TABLE `listings`
  ADD CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `listing_images`
--
ALTER TABLE `listing_images`
  ADD CONSTRAINT `listing_images_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `phone_requests`
--
ALTER TABLE `phone_requests`
  ADD CONSTRAINT `phone_requests_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
