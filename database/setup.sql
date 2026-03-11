-- ================================================
-- Hospital Appointment System - Database Setup
-- Run this in phpMyAdmin or MySQL CLI with XAMPP
-- ================================================

CREATE DATABASE IF NOT EXISTS hospital_db 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE hospital_db;

-- Note: Spring Boot JPA will auto-create tables on first run
-- This file is for manual reference / initial setup

-- Grant permissions (if needed)
-- GRANT ALL PRIVILEGES ON hospital_db.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

SELECT 'Database hospital_db created successfully!' AS message;
