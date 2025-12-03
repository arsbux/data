-- Enable RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Sites policies
CREATE POLICY "Users can view their own sites"
  ON sites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sites"
  ON sites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sites"
  ON sites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sites"
  ON sites FOR DELETE
  USING (auth.uid() = user_id);

-- Page views policies
-- Public can insert (via tracking script) - ideally this should be restricted to service role or specific API key
-- For now, we'll allow public insert but no select
CREATE POLICY "Public can insert page views"
  ON page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view page views for their sites"
  ON page_views FOR SELECT
  USING (site_id IN (SELECT site_id FROM sites WHERE user_id = auth.uid()));

-- Sessions policies
CREATE POLICY "Public can insert sessions"
  ON sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view sessions for their sites"
  ON sessions FOR SELECT
  USING (site_id IN (SELECT site_id FROM sites WHERE user_id = auth.uid()));

-- Active visitors policies
CREATE POLICY "Public can insert active visitors"
  ON active_visitors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update active visitors"
  ON active_visitors FOR UPDATE
  USING (true);

CREATE POLICY "Users can view active visitors for their sites"
  ON active_visitors FOR SELECT
  USING (site_id IN (SELECT site_id FROM sites WHERE user_id = auth.uid()));

-- Events policies
CREATE POLICY "Public can insert events"
  ON events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view events for their sites"
  ON events FOR SELECT
  USING (site_id IN (SELECT site_id FROM sites WHERE user_id = auth.uid()));
