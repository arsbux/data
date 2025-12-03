-- Allow public read access for demo purposes (since auth is removed)
DROP POLICY IF EXISTS "Users can view their own sites" ON sites;
CREATE POLICY "Public can view all sites" ON sites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view page views for their sites" ON page_views;
CREATE POLICY "Public can view all page views" ON page_views FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view sessions for their sites" ON sessions;
CREATE POLICY "Public can view all sessions" ON sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view active visitors for their sites" ON active_visitors;
CREATE POLICY "Public can view all active visitors" ON active_visitors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view events for their sites" ON events;
CREATE POLICY "Public can view all events" ON events FOR SELECT USING (true);
