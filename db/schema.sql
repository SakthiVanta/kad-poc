-- =============================================================================
-- KAD CRM — Field Intelligence
-- Database Schema: Auth, Session, User Management, Location & Beats
-- PostgreSQL
-- =============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =============================================================================
-- 1. USER MANAGEMENT
-- =============================================================================

CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) UNIQUE NOT NULL,   -- 'admin', 'kam', 'kae'
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES
    ('admin', 'System administrator'),
    ('kam',   'Key Account Manager — manages KAEs and beats'),
    ('kae',   'Key Account Executive — field sales representative');


CREATE TABLE departments (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emp_id        VARCHAR(50) UNIQUE,              -- e.g. BWG_KAE_001
    name          VARCHAR(150) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    phone         VARCHAR(20),
    password_hash TEXT NOT NULL,
    role_id       INTEGER NOT NULL REFERENCES roles(id),
    department_id INTEGER REFERENCES departments(id),
    status        VARCHAR(20) NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'inactive', 'suspended')),
    -- A KAE reports to a KAM
    manager_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role_id    ON users(role_id);
CREATE INDEX idx_users_manager_id ON users(manager_id);
CREATE INDEX idx_users_emp_id     ON users(emp_id);
CREATE INDEX idx_users_email      ON users(email);


-- =============================================================================
-- 2. AUTH & SESSION MANAGEMENT
-- =============================================================================

-- Active JWT / bearer sessions
CREATE TABLE sessions (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash    TEXT NOT NULL UNIQUE,   -- SHA-256 of the access token
    device_info   JSONB,                  -- { "userAgent": "...", "ip": "..." }
    expires_at    TIMESTAMPTZ NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id    ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);


-- Refresh tokens (long-lived, rotated on use)
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL UNIQUE,     -- SHA-256 of the opaque refresh token
    is_revoked  BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);


-- Password reset OTPs / tokens
CREATE TABLE password_resets (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL UNIQUE,
    is_used     BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =============================================================================
-- 3. LOCATION & BEATS
-- =============================================================================

CREATE TABLE cities (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) UNIQUE NOT NULL,   -- 'Chennai', 'Bangalore'
    state      VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE areas (
    id         SERIAL PRIMARY KEY,
    city_id    INTEGER NOT NULL REFERENCES cities(id),
    name       VARCHAR(150) NOT NULL,          -- 'T Nagar', 'Adyar'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (city_id, name)
);

CREATE INDEX idx_areas_city_id ON areas(city_id);


-- A beat is a geographic sales territory assigned to a KAE
CREATE TABLE beats (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code           VARCHAR(50) UNIQUE NOT NULL,  -- e.g. 'BT-001'
    name           VARCHAR(150) NOT NULL,
    area_id        INTEGER NOT NULL REFERENCES areas(id),
    status         VARCHAR(20) NOT NULL DEFAULT 'active'
                       CHECK (status IN ('active', 'inactive')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_beats_area_id ON beats(area_id);
CREATE INDEX idx_beats_code    ON beats(code);


-- A KAE is assigned to one or more beats (KAM manages the assignment)
CREATE TABLE beat_assignments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beat_id     UUID NOT NULL REFERENCES beats(id) ON DELETE CASCADE,
    kae_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,  -- KAM who assigned
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unassigned_at TIMESTAMPTZ,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (beat_id, kae_id, is_active)   -- only one active assignment per beat-KAE pair
);

CREATE INDEX idx_beat_assignments_beat_id ON beat_assignments(beat_id);
CREATE INDEX idx_beat_assignments_kae_id  ON beat_assignments(kae_id);


-- A mandapam is a venue/hall within a beat
CREATE TABLE mandapams (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beat_id        UUID NOT NULL REFERENCES beats(id) ON DELETE CASCADE,
    name           VARCHAR(200) NOT NULL,
    address        TEXT,
    contact_name   VARCHAR(150),
    contact_phone  VARCHAR(20),
    status         VARCHAR(20) NOT NULL DEFAULT 'active'
                       CHECK (status IN ('active', 'pending', 'inactive')),
    bwg_promise    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mandapams_beat_id ON mandapams(beat_id);


-- =============================================================================
-- 4. AUDIT
-- =============================================================================

-- Lightweight activity log (auth events, assignment changes, etc.)
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    actor_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,   -- 'login', 'logout', 'beat_assigned', etc.
    entity_type VARCHAR(100),            -- 'user', 'beat', 'mandapam'
    entity_id   TEXT,
    meta        JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor_id    ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity      ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at  ON audit_logs(created_at);


-- =============================================================================
-- 5. AUTO-UPDATE updated_at TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_beats_updated_at
    BEFORE UPDATE ON beats
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_mandapams_updated_at
    BEFORE UPDATE ON mandapams
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
