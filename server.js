const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/search', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Missing username' });

  try {
    const searchUrl = `https://www.facebook.com/public/${encodeURIComponent(username)}`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(data);
    const results = [];

    $('a[href^="https://www.facebook.com/"]').each((i, el) => {
      const name = $(el).text().trim();
      const profileUrl = $(el).attr('href');

      if (name && profileUrl) {
        try {
          const urlObj = new URL(profileUrl);
          const path = urlObj.pathname;

          // Accept URLs that:
          // 1) Contain /people/ (typical for public profiles)
          // OR
          // 2) Path looks like /username (only one segment, no extra slashes), excluding known non-profile pages
          if (
            path.includes('/people/') ||
            (/^\/[a-zA-Z0-9.\-_]+$/.test(path) &&
             !profileUrl.includes('watch') &&
             !profileUrl.includes('help') &&
             !profileUrl.includes('pages') &&
             !profileUrl.includes('events') &&
             !profileUrl.includes('groups'))
          ) {
            results.push({ name, profileUrl });
          }
        } catch {
          // Ignore invalid URLs
        }
      }
    });

    if (results.length === 0) {
      return res.json({ message: "❗ No profiles found matching that username." });
    }

    res.json({ profiles: results.slice(0, 5) }); // Return top 5 profiles
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Facebook profiles" });
  }
});

app.get('/', (req, res) => {
  res.send("✅ API is live. Use /search?username=NAME to fetch profiles.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
