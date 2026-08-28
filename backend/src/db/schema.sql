-- Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- trains
CREATE TABLE IF NOT EXISTS trains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  origin_station_id UUID,
  destination_station_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- stations
CREATE TABLE IF NOT EXISTS stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE,
  name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL
);

-- Add FK after both tables exist
ALTER TABLE trains
  ADD CONSTRAINT fk_origin FOREIGN KEY (origin_station_id) REFERENCES stations(id),
  ADD CONSTRAINT fk_destination FOREIGN KEY (destination_station_id) REFERENCES stations(id);

-- routes
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  train_id UUID NOT NULL REFERENCES trains(id),
  geometry GEOMETRY(LineString, 4326),
  distance_km DECIMAL(10, 2),
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- route_stations
CREATE TABLE IF NOT EXISTS route_stations (
  route_id UUID NOT NULL REFERENCES routes(id),
  station_id UUID NOT NULL REFERENCES stations(id),
  sequence INT NOT NULL,
  scheduled_arrival TIME,
  scheduled_departure TIME,
  PRIMARY KEY (route_id, station_id)
);

-- journey_snapshots (retain for 7 days only)
CREATE TABLE IF NOT EXISTS journey_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  train_id UUID NOT NULL REFERENCES trains(id),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  status VARCHAR(20) NOT NULL,
  delay_minutes INT DEFAULT 0,
  current_station_id UUID REFERENCES stations(id),
  next_station_id UUID REFERENCES stations(id),
  captured_at TIMESTAMPTZ DEFAULT NOW()
);
-- NOTE: Add a pg_cron job or application-level job to DELETE FROM journey_snapshots WHERE captured_at < NOW() - INTERVAL '7 days';

-- share_links
CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_token_hash VARCHAR(255) NOT NULL UNIQUE,
  train_id UUID NOT NULL REFERENCES trains(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

-- user_favourites
CREATE TABLE IF NOT EXISTS user_favourites (
  user_id UUID NOT NULL,
  train_id UUID NOT NULL REFERENCES trains(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, train_id)
);

-- Spatial index on routes
CREATE INDEX IF NOT EXISTS idx_routes_geometry ON routes USING GIST (geometry);
-- Index for snapshot cleanup
CREATE INDEX IF NOT EXISTS idx_snapshots_captured_at ON journey_snapshots (captured_at);
