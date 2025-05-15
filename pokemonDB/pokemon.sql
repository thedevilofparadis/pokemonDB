-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Mag 11, 2025 alle 17:44
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `personaggi`
--
CREATE DATABASE IF NOT EXISTS pokemonDB;
USE pokemonDB;
-- --------------------------------------------------------

--
-- Struttura della tabella `pokemon`
--

CREATE TABLE `pokemon` (
  `idP` int(11) NOT NULL,
  `nomeP` varchar(20) DEFAULT NULL,
  `attP` int(11) DEFAULT NULL,
  `defP` int(11) DEFAULT NULL,
  `hpP` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `pokemon`
--

INSERT INTO `pokemon` (`idP`, `nomeP`, `attP`, `defP`, `hpP`) VALUES
(1, 'gdrg', 23, 1, 43),
(28, 'luca', 3, 18, 99),
(29, 'ewq', 2, 12, 12),
(30, 'erwq', 12, 21, 21),
(31, 'refw', 12, 12, 12),
(32, 'fsd', 12, 12, 12),
(33, 'geegr', 34, 34, 34),
(34, 'we', 12, 12, 12),
(35, 'gfd', 87, 7, 7),
(36, 're', 43, 21, 32),
(37, 'mnb', 76, 21, 23),
(38, 'fsfs', 12, 32, 12),
(39, 'kjh', 43, 32, 43),
(40, 'grdg', 32, 12, 43),
(41, 'a', 12, 12, 12),
(42, 'v', 12, 12, 12),
(43, 'fd', 12, 12, 12),
(44, 'gfbvc', 12, 12, 12),
(45, 'f', 12, 12, 21),
(46, 'vcx', 12, 12, 12),
(48, 'ff', 12, 12, 12),
(49, '3fsf', 12, 12, 12),
(50, 'gh', 12, 12, 12),
(51, 'rte', 12, 12, 12),
(52, '1', 1, 1, 1),
(53, '2', 2, 2, 2),
(54, '3', 3, 3, 3),
(55, 'adssf', 12, 12, 12),
(56, '4', 4, 4, 4),
(57, 'gfgf', 21, 12, 12),
(58, 'fe', 43, 21, 32),
(60, 'prova1', 40, 40, 40),
(61, 'prova2', 40, 40, 40),
(62, 'fssdfesafad', 1, 1, 1),
(63, 'rfefwfwefwfw', 12, 12, 12),
(64, '2324e', 12, 12, 12),
(65, 'fesf', 12, 12, 12),
(66, 'fdsfs', 12, 21, 1),
(67, 'bnfgnnf', 21, 21, 21),
(68, 'fadf', 12, 12, 12),
(69, 'xvxdv', 12, 12, 12),
(70, 'fdsfsfsfdsfsd', 12, 12, 12),
(72, 'fdsfsdvsvsdv', 12, 12, 12),
(73, 'vsdvsdvs', 12, 12, 12),
(74, 'gvsvsdvs', 12, 12, 12),
(75, 'bgbnfgnf', 13, 13, 13),
(76, 'fdfsfdsfssffdcsf', 12, 12, 12),
(77, 'ghtgfhfgth', 43, 21, 32),
(78, 'fgsvcsf', 12, 12, 12),
(79, 'mnbmvbnvn', 12, 12, 12),
(80, 'vbxvx', 12, 12, 12),
(81, 'jhjg', 23, 23, 23),
(82, 'fdsfshgfnhgfjfgy', 12, 12, 12),
(83, 'vxcvx', 13, 31, 13),
(84, 'hgbdc', 12, 12, 12),
(85, 'ouiou', 12, 12, 12),
(86, 'gfdgre', 12, 12, 12),
(87, 'bfbdfbsdxf', 13, 13, 13);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `pokemon`
--
ALTER TABLE `pokemon`
  ADD PRIMARY KEY (`idP`),
  ADD UNIQUE KEY `nomeP` (`nomeP`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `pokemon`
--
ALTER TABLE `pokemon`
  MODIFY `idP` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
