-- Add unique constraint to sessions table to allow upserting
ALTER TABLE sessions ADD CONSTRAINT sessions_site_id_session_id_key UNIQUE (site_id, session_id);
