-- International Buyer Discovery & Outreach Portal
-- Database Schema DDL for MySQL

CREATE DATABASE IF NOT EXISTS buyer_discovery;
USE buyer_discovery;

-- Drop tables if they exist (ordered by dependencies)
DROP TABLE IF EXISTS outreach;
DROP TABLE IF EXISTS buyers;
DROP TABLE IF EXISTS searches;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  company_name VARCHAR(150) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Searches Table
CREATE TABLE searches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  niche VARCHAR(150) NOT NULL,
  country VARCHAR(100) NOT NULL,
  results_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_searches_user (user_id),
  INDEX idx_searches_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Buyers Table
CREATE TABLE buyers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  email VARCHAR(150) NOT NULL,
  website VARCHAR(255) DEFAULT NULL,
  country VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  industry VARCHAR(100) DEFAULT NULL,
  source_url VARCHAR(255) DEFAULT NULL,
  email_verified TINYINT(1) DEFAULT 0,
  email_source VARCHAR(100) DEFAULT 'serpapi_snippet',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_buyers_user (user_id),
  INDEX idx_buyers_email (email),
  INDEX idx_buyers_country (country),
  INDEX idx_buyers_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Outreach Table
CREATE TABLE outreach (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  buyer_id INT DEFAULT NULL,
  recipient_email VARCHAR(150) NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  attachment_name VARCHAR(255) DEFAULT NULL,
  status ENUM('Sent', 'Failed', 'Pending') DEFAULT 'Sent',
  error_message TEXT DEFAULT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE SET NULL,
  INDEX idx_outreach_user (user_id),
  INDEX idx_outreach_status (status),
  INDEX idx_outreach_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Settings Table
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  smtp_host VARCHAR(150) DEFAULT 'smtp.gmail.com',
  smtp_port INT DEFAULT 465,
  smtp_user VARCHAR(150) DEFAULT NULL,
  smtp_from VARCHAR(150) DEFAULT NULL,
  serpapi_key VARCHAR(255) DEFAULT NULL,
  gemini_api_key VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_settings_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
