-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create supervisors table
CREATE TABLE supervisors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create assistants table
CREATE TABLE assistants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    supervisor_id UUID NOT NULL REFERENCES supervisors(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name VARCHAR(255) NOT NULL,
    matric_number VARCHAR(50) UNIQUE NOT NULL,
    supervisor_id UUID NOT NULL REFERENCES supervisors(id) ON DELETE RESTRICT,
    assistant_id UUID NOT NULL REFERENCES assistants(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create system_settings table
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    portal_open BOOLEAN DEFAULT false,
    -- Ensure only one row exists
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial settings row
INSERT INTO system_settings (id, portal_open) VALUES (1, true) ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX idx_matric ON submissions(matric_number);
CREATE INDEX idx_supervisor ON submissions(supervisor_id);
