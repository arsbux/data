-- Create default partition for page_views
CREATE TABLE page_views_default PARTITION OF page_views DEFAULT;

-- Create default partition for events
CREATE TABLE events_default PARTITION OF events DEFAULT;
