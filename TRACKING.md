# Tracking Setup

To track visitors on any website, add the following script tag to the `<head>` of your HTML:

```html
<script defer src="https://data.flightlabs.agency/trackify.js" data-site-id="YOUR_SITE_ID"></script>
```

## Configuration

- **`src`**: Must point to your deployed instance (`https://data.flightlabs.agency/trackify.js`).
- **`data-site-id`**: A unique identifier for the site you are tracking (e.g., `my-portfolio`, `landing-page-v1`). You can use any string you like; it will automatically appear in your dashboard.

## Verification

1. Add the script to your site.
2. Open your site in a browser.
3. Open the Network tab in Developer Tools.
4. Verify that a POST request is sent to `https://data.flightlabs.agency/api/ingest` with status `200 OK`.
