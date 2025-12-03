-- Sites table (multi-tenancy support)
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  name TEXT NOT NULL,
  site_id TEXT UNIQUE NOT NULL, -- Public tracking ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- Page views table (partitioned by date for performance)
CREATE TABLE page_views (
  id BIGSERIAL,
  site_id TEXT NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL, -- Anonymous visitor identifier
  session_id UUID NOT NULL,
  
  -- Page data
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  title TEXT,
  referrer TEXT,
  referrer_domain TEXT,
  
  -- UTM parameters
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Device data
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  os_version TEXT,
  device_type TEXT, -- mobile, desktop, tablet
  screen_width INT,
  screen_height INT,
  
  -- Location data
  country TEXT,
  country_code TEXT,
  region TEXT,
  city TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  
  -- Timing
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  duration INT, -- Time spent on page (seconds)
  
  PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE INDEX idx_page_views_site_timestamp ON page_views (site_id, timestamp DESC);
CREATE INDEX idx_page_views_visitor_session ON page_views (visitor_id, session_id);
CREATE INDEX idx_page_views_path ON page_views (site_id, path);
CREATE INDEX idx_page_views_referrer ON page_views (site_id, referrer_domain);

-- Sessions table (aggregated data)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id TEXT NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  session_id UUID NOT NULL,
  
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration INT, -- Total session duration in seconds
  page_views INT DEFAULT 1,
  bounced BOOLEAN DEFAULT FALSE,
  
  -- Entry page
  entry_url TEXT,
  entry_referrer TEXT,
  
  -- Exit page
  exit_url TEXT,
  
  -- Location (from first page view)
  country_code TEXT,
  city TEXT,
  
  -- Device (from first page view)
  device_type TEXT,
  browser TEXT,
  os TEXT
);

CREATE INDEX idx_sessions_site_started ON sessions (site_id, started_at DESC);

-- Live visitors (ephemeral table for real-time dashboard)
CREATE TABLE active_visitors (
  site_id TEXT NOT NULL,
  visitor_id UUID NOT NULL,
  session_id UUID NOT NULL,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  current_page TEXT,
  country_code TEXT,
  city TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  
  PRIMARY KEY (site_id, visitor_id)
);

CREATE INDEX idx_active_visitors_last_seen ON active_visitors (last_seen);

-- Custom events (for future expansion)
CREATE TABLE events (
  id BIGSERIAL,
  site_id TEXT NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  session_id UUID NOT NULL,
  
  event_name TEXT NOT NULL,
  event_data JSONB,
  
  url TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE INDEX idx_events_site_event ON events (site_id, event_name, timestamp DESC);
