-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 23, 2025 at 12:40 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_reavel`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id` bigint UNSIGNED NOT NULL,
  `nama_kategori` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id`, `nama_kategori`, `created_at`, `updated_at`) VALUES
(1, 'Minuman', '2025-04-28 00:44:51', '2025-04-28 00:44:51'),
(2, 'Makanan', '2025-04-28 00:44:56', '2025-04-28 00:44:56');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_04_17_024858_create_penitips_table', 1),
(5, '2025_04_17_024932_create_kategoris_table', 1),
(6, '2025_04_17_025008_create_produks_table', 1),
(7, '2025_04_17_025122_create_produk_stoks_table', 1),
(8, '2025_04_17_025155_create_transaksis_table', 1),
(9, '2025_04_17_025248_create_transaksi_items_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `penitip`
--

CREATE TABLE `penitip` (
  `id` bigint UNSIGNED NOT NULL,
  `nama_penitip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `penitip`
--

INSERT INTO `penitip` (`id`, `nama_penitip`, `created_at`, `updated_at`) VALUES
(1, 'Bu Lastri', '2025-04-28 00:45:12', '2025-04-28 00:45:12'),
(2, 'RPL', '2025-04-28 00:45:17', '2025-04-28 00:45:17'),
(3, 'Pak Gozali', '2025-04-28 00:45:51', '2025-04-28 00:45:51'),
(4, 'wisnu 10 pplg 1', '2025-04-28 00:46:13', '2025-04-28 00:46:13'),
(5, 'Marisa XI PPLG', '2025-04-28 00:46:43', '2025-04-28 00:46:43'),
(6, 'Pak Sabar', '2025-04-28 00:47:23', '2025-04-28 00:47:23'),
(7, 'Artifah PPLG 2', '2025-04-28 00:48:02', '2025-04-28 00:48:02'),
(8, 'Airin xipplg1', '2025-04-28 00:48:34', '2025-04-28 00:48:34'),
(9, 'lili', '2025-04-28 00:49:08', '2025-04-28 00:49:08'),
(10, 'indy xi pplg 1', '2025-04-28 00:49:32', '2025-04-28 00:49:32'),
(11, 'salsabila kirani pplg 1', '2025-04-28 00:50:12', '2025-04-28 00:50:12'),
(12, 'Mas Tyo', '2025-04-28 00:50:58', '2025-04-28 00:50:58'),
(13, 'tantri pplg 1', '2025-04-28 00:51:26', '2025-04-28 00:51:26'),
(14, 'laili XI PPLG 2', '2025-04-28 00:52:12', '2025-04-28 00:52:12'),
(15, 'bu titin', '2025-04-28 00:53:02', '2025-04-28 00:53:02'),
(16, 'alfin XI PPLG 1', '2025-04-28 00:53:42', '2025-04-28 00:53:42'),
(17, 'm.satria alimufti xi bd 1', '2025-04-28 00:54:21', '2025-04-28 00:54:21'),
(18, 'Ukhti x pplg 1', '2025-04-28 00:54:48', '2025-04-28 00:54:48'),
(19, 'ina nashabila xi akl 2', '2025-04-28 00:55:26', '2025-04-28 00:55:26'),
(20, 'nelis XI MPLB 2', '2025-04-28 00:56:03', '2025-04-28 00:56:03'),
(21, 'Zaky', '2025-04-29 00:15:46', '2025-04-29 00:15:46');

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `id` bigint UNSIGNED NOT NULL,
  `kode_produk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_produk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_penitip` bigint UNSIGNED NOT NULL,
  `id_kategori` bigint UNSIGNED NOT NULL,
  `stok_masukSementara` int NOT NULL DEFAULT '0',
  `stok_akhirSementara` int NOT NULL DEFAULT '0',
  `hpp` int DEFAULT NULL,
  `harga` int NOT NULL,
  `diskon` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id`, `kode_produk`, `nama_produk`, `id_penitip`, `id_kategori`, `stok_masukSementara`, `stok_akhirSementara`, `hpp`, `harga`, `diskon`, `created_at`, `updated_at`) VALUES
(1, 'PRD-000001', 'pop mie', 2, 2, 10, 8, NULL, 7000, NULL, '2025-04-28 00:57:00', '2025-04-29 06:22:35'),
(2, 'PRD-000002', 'es sachet', 2, 1, 89, 52, NULL, 2000, NULL, '2025-04-28 00:57:43', '2025-06-22 08:00:06'),
(3, 'PRD-000003', 'zam botol', 2, 1, 22, 6, NULL, 2000, NULL, '2025-04-28 00:58:20', '2025-04-29 06:22:35'),
(4, 'PRD-000004', 'mie keriting', 2, 2, 12, 0, NULL, 2000, NULL, '2025-04-28 00:58:57', '2025-04-29 06:22:35'),
(5, 'PRD-000005', 'mie biting besar', 2, 2, 14, 12, NULL, 3000, NULL, '2025-04-28 00:59:31', '2025-04-29 06:22:35'),
(6, 'PRD-000006', 'good day kecil', 2, 1, 13, 7, NULL, 3500, NULL, '2025-04-28 01:00:08', '2025-04-29 06:22:35'),
(7, 'PRD-000007', 'Good Day Cappucino', 2, 1, 5, 0, NULL, 4000, NULL, '2025-04-28 01:00:44', '2025-04-29 06:22:35'),
(8, 'PRD-000008', 'Chocolatos', 2, 1, 18, 10, NULL, 4000, NULL, '2025-04-28 01:01:11', '2025-04-29 06:22:35'),
(9, 'PRD-000009', 'Beng-beng', 2, 1, 9, 6, NULL, 4000, NULL, '2025-04-28 01:01:35', '2025-04-29 06:22:35'),
(10, 'PRD-000010', 'Chocodrink', 2, 1, 80, 79, NULL, 4000, NULL, '2025-04-28 01:02:05', '2025-06-22 08:03:00'),
(11, 'PRD-000011', 'Indocafe', 2, 1, 5, 1, NULL, 3500, NULL, '2025-04-28 01:02:34', '2025-04-29 06:22:35'),
(12, 'PRD-000012', 'Indocafe Cappucino', 2, 1, 0, 0, NULL, 4000, NULL, '2025-04-28 01:04:47', '2025-04-29 00:15:10'),
(13, 'PRD-000013', 'kapal api', 2, 1, 0, 0, NULL, 3500, NULL, '2025-04-28 01:05:23', '2025-04-29 00:15:10'),
(14, 'PRD-000014', 'top cappucino', 2, 1, 0, 0, NULL, 4000, NULL, '2025-04-28 01:06:28', '2025-04-29 00:15:10'),
(15, 'PRD-000015', 'tahu isi', 1, 2, 20, 14, NULL, 1500, NULL, '2025-04-28 01:07:52', '2025-04-29 06:22:35'),
(16, 'PRD-000016', 'sosis solo', 1, 2, 15, 5, NULL, 2000, NULL, '2025-04-28 01:08:19', '2025-04-29 06:22:35'),
(17, 'PRD-000017', 'rice bowl', 1, 2, 15, 5, NULL, 8000, NULL, '2025-04-28 01:08:44', '2025-04-29 06:22:35'),
(18, 'PRD-000018', 'tahu ayam', 1, 2, 10, 8, NULL, 2000, NULL, '2025-04-28 01:09:19', '2025-04-29 06:22:35'),
(19, 'PRD-000019', 'donat', 1, 2, 12, 4, NULL, 3000, NULL, '2025-04-28 01:09:46', '2025-04-29 06:22:35'),
(20, 'PRD-000020', 'Tahu Bakso', 21, 2, 20, 14, NULL, 1500, NULL, '2025-04-29 00:16:30', '2025-04-29 06:22:35'),
(21, 'PRD-000021', 'Roti Mayo', 19, 2, 5, 2, NULL, 2000, NULL, '2025-04-29 00:18:23', '2025-04-29 06:22:35'),
(22, 'PRD-000022', 'Bapao Mini', 19, 2, 7, 2, NULL, 1000, NULL, '2025-04-29 00:18:50', '2025-04-29 06:22:35'),
(23, 'PRD-000023', 'Risol bihun', 19, 2, 10, 6, NULL, 1500, NULL, '2025-04-29 00:19:13', '2025-04-29 06:22:35'),
(24, 'PRD-000024', 'tempe', 11, 2, 20, 6, NULL, 1000, NULL, '2025-04-29 00:27:04', '2025-04-29 06:22:35');

-- --------------------------------------------------------

--
-- Table structure for table `produk_stoks`
--

CREATE TABLE `produk_stoks` (
  `id` bigint UNSIGNED NOT NULL,
  `id_produk` bigint UNSIGNED NOT NULL,
  `id_penitip` bigint UNSIGNED NOT NULL,
  `stok_masuk` int NOT NULL DEFAULT '0',
  `stok_akhir` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `produk_stoks`
--

INSERT INTO `produk_stoks` (`id`, `id_produk`, `id_penitip`, `stok_masuk`, `stok_akhir`, `created_at`, `updated_at`) VALUES
(24, 20, 21, 20, 14, '2025-04-29 00:16:30', '2025-04-29 06:22:35'),
(25, 21, 19, 5, 2, '2025-04-29 00:18:23', '2025-04-29 06:22:35'),
(26, 22, 19, 7, 2, '2025-04-29 00:18:50', '2025-04-29 06:22:35'),
(27, 23, 19, 10, 6, '2025-04-29 00:19:13', '2025-04-29 06:22:35'),
(28, 3, 2, 22, 6, '2025-04-29 00:20:44', '2025-04-29 06:22:35'),
(29, 5, 2, 14, 12, '2025-04-29 00:21:12', '2025-04-29 06:22:35'),
(30, 4, 2, 12, 0, '2025-04-29 00:21:20', '2025-04-29 06:22:35'),
(31, 2, 2, 89, 64, '2025-04-29 00:21:38', '2025-04-29 06:22:35'),
(32, 1, 2, 10, 8, '2025-04-29 00:21:48', '2025-04-29 06:22:35'),
(33, 8, 2, 18, 10, '2025-04-29 00:22:53', '2025-04-29 06:22:35'),
(34, 9, 2, 9, 6, '2025-04-29 00:23:23', '2025-04-29 06:22:35'),
(35, 6, 2, 13, 7, '2025-04-29 00:24:23', '2025-04-29 06:22:35'),
(36, 7, 2, 5, 0, '2025-04-29 00:24:31', '2025-04-29 06:22:35'),
(37, 24, 11, 20, 6, '2025-04-29 00:27:04', '2025-04-29 06:22:35'),
(38, 19, 1, 12, 4, '2025-04-29 00:35:35', '2025-04-29 06:22:35'),
(39, 16, 1, 15, 5, '2025-04-29 00:36:24', '2025-04-29 06:22:35'),
(40, 17, 1, 15, 5, '2025-04-29 00:36:45', '2025-04-29 06:22:35'),
(41, 15, 1, 20, 14, '2025-04-29 00:37:00', '2025-04-29 06:22:35'),
(42, 18, 1, 10, 8, '2025-04-29 00:37:07', '2025-04-29 06:22:35'),
(44, 11, 2, 5, 1, '2025-04-29 02:12:15', '2025-04-29 06:22:35'),
(45, 10, 2, 80, 79, '2025-06-22 08:02:14', '2025-06-22 08:03:00');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('CAWjjiy7BeHV2rF4uqGlr7jQ3zSV2EhNmI2pJP18', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoieXdYMjlPZlZ4VkZ2bEppajdjd1FvOWU3OTY2dHNmVXM3cWhWSTM1ciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9wb2ludC1vZi1zYWxlcyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjI7fQ==', 1758587846),
('vz1G4ycEmyB2wxXzkjtAuxz6e4dyCDiumeAcspt0', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoid2g4WFByTGVZclh1MW9jcXNLZDhkanJrS3FDT0x4NENOQ1gwT2xyOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9wb2ludC1vZi1zYWxlcyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjI7fQ==', 1758511764);

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` bigint UNSIGNED NOT NULL,
  `invoice` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_bayar` int NOT NULL,
  `diskon` int DEFAULT NULL,
  `potongan` int DEFAULT NULL,
  `bayar` int NOT NULL,
  `kembalian` int NOT NULL,
  `bulan` char(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id`, `invoice`, `total_bayar`, `diskon`, `potongan`, `bayar`, `kembalian`, `bulan`, `created_at`, `updated_at`) VALUES
(3, 'TRX6810702B6D2A4', 417000, NULL, NULL, 417000, 0, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(4, 'TRX6857B8061CDD5', 24000, NULL, NULL, 25000, 1000, NULL, '2025-06-22 08:00:06', '2025-06-22 08:00:06'),
(5, 'TRX6857B8B444184', 4000, NULL, NULL, 4000, 0, NULL, '2025-06-22 08:03:00', '2025-06-22 08:03:00');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_items`
--

CREATE TABLE `transaksi_items` (
  `id` bigint UNSIGNED NOT NULL,
  `id_transaksi` bigint UNSIGNED NOT NULL,
  `id_produk` bigint UNSIGNED NOT NULL,
  `id_penitip` bigint UNSIGNED NOT NULL,
  `jumlah_beli` int NOT NULL,
  `harga` int NOT NULL,
  `laba` int NOT NULL,
  `total_harga` int NOT NULL,
  `total_uang_penitip` int NOT NULL,
  `diskon` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaksi_items`
--

INSERT INTO `transaksi_items` (`id`, `id_transaksi`, `id_produk`, `id_penitip`, `jumlah_beli`, `harga`, `laba`, `total_harga`, `total_uang_penitip`, `diskon`, `created_at`, `updated_at`) VALUES
(5, 3, 15, 1, 6, 1500, 900, 9000, 8100, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(6, 3, 18, 1, 2, 2000, 400, 4000, 3600, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(7, 3, 24, 11, 14, 1000, 1400, 14000, 12600, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(8, 3, 20, 21, 6, 1500, 900, 9000, 8100, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(9, 3, 16, 1, 10, 2000, 2000, 20000, 18000, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(10, 3, 5, 2, 2, 3000, 600, 6000, 5400, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(11, 3, 4, 2, 12, 2000, 2400, 24000, 21600, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(12, 3, 19, 1, 8, 3000, 2400, 24000, 21600, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(13, 3, 23, 19, 4, 1500, 600, 6000, 5400, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(14, 3, 22, 19, 5, 1000, 500, 5000, 4500, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(15, 3, 21, 19, 3, 2000, 600, 6000, 5400, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(16, 3, 17, 1, 10, 8000, 8000, 80000, 72000, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(18, 3, 1, 2, 2, 7000, 1400, 14000, 12600, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(19, 3, 2, 2, 25, 2000, 5000, 50000, 45000, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(20, 3, 3, 2, 16, 2000, 3200, 32000, 28800, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(21, 3, 6, 2, 6, 3500, 2100, 21000, 18900, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(22, 3, 9, 2, 3, 4000, 1200, 12000, 10800, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(23, 3, 7, 2, 5, 4000, 2000, 20000, 18000, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(24, 3, 11, 2, 4, 3500, 1400, 14000, 12600, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(25, 3, 8, 2, 8, 4000, 3200, 32000, 28800, NULL, '2025-04-29 06:22:35', '2025-04-29 06:22:35'),
(26, 4, 2, 2, 12, 2000, 2400, 24000, 21600, NULL, '2025-06-22 08:00:06', '2025-06-22 08:00:06'),
(27, 5, 10, 2, 1, 4000, 400, 4000, 3600, NULL, '2025-06-22 08:03:00', '2025-06-22 08:03:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','petugas') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@gmail.com', NULL, '$2y$12$GYQ3uYjRwMcRJM7YzrwL3OE/TxxslHf8fS8h8w6/urH2Hv37VBwCO', 'admin', NULL, '2025-04-28 00:43:48', '2025-04-28 00:43:48'),
(2, 'petugas', 'petugas@gmail.com', NULL, '$2y$12$3QWDfVNhAwCul.Wl/CXfu.SFQArR53vROhD4iLbVHjPp0dApInMJq', 'petugas', 'denW7JhFOA3zVz0V3JVnBbDlVo3XC6BR6OpybgeNNo1HPEYgJzkA9jmmXQHk', '2025-04-28 00:44:31', '2025-04-28 00:44:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `penitip`
--
ALTER TABLE `penitip`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produk_id_penitip_foreign` (`id_penitip`),
  ADD KEY `produk_id_kategori_foreign` (`id_kategori`);

--
-- Indexes for table `produk_stoks`
--
ALTER TABLE `produk_stoks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produk_stoks_id_produk_foreign` (`id_produk`),
  ADD KEY `produk_stoks_id_penitip_foreign` (`id_penitip`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaksi_items`
--
ALTER TABLE `transaksi_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaksi_items_id_transaksi_foreign` (`id_transaksi`),
  ADD KEY `transaksi_items_id_produk_foreign` (`id_produk`),
  ADD KEY `transaksi_items_id_penitip_foreign` (`id_penitip`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `penitip`
--
ALTER TABLE `penitip`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `produk_stoks`
--
ALTER TABLE `produk_stoks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transaksi_items`
--
ALTER TABLE `transaksi_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `produk`
--
ALTER TABLE `produk`
  ADD CONSTRAINT `produk_id_kategori_foreign` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `produk_id_penitip_foreign` FOREIGN KEY (`id_penitip`) REFERENCES `penitip` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `produk_stoks`
--
ALTER TABLE `produk_stoks`
  ADD CONSTRAINT `produk_stoks_id_penitip_foreign` FOREIGN KEY (`id_penitip`) REFERENCES `penitip` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `produk_stoks_id_produk_foreign` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transaksi_items`
--
ALTER TABLE `transaksi_items`
  ADD CONSTRAINT `transaksi_items_id_penitip_foreign` FOREIGN KEY (`id_penitip`) REFERENCES `penitip` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transaksi_items_id_produk_foreign` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transaksi_items_id_transaksi_foreign` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
