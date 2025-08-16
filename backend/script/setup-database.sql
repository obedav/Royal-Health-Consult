-- Database Setup Script for Royal Health Consult
-- Run this script to create the database and user

-- Create database
CREATE DATABASE royal_health_db;

-- Create user (replace 'your_secure_password' with a strong password)
CREATE USER royal_health_user WITH ENCRYPTED PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE royal_health_db TO royal_health_user;

-- Connect to the database
\c royal_health_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO royal_health_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO royal_health_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO royal_health_user;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types that will be used by TypeORM
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('client', 'nurse', 'admin');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status_enum') THEN
        CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
    END IF;
END $$;

-- Grant usage on types
GRANT USAGE ON TYPE user_role_enum TO royal_health_user;
GRANT USAGE ON TYPE user_status_enum TO royal_health_user;