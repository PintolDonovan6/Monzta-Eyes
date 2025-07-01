const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/search', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Missing username' });

  try {
    const searchUrl = `https://www.facebook.com/public/${encodeURIComponent(username)}`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    $('a[href^="https://www.facebook.com/"]').each((i, el) => {
      const name = $(el).text();
      const profileUrl = $(el).attr('href');
      if (name && profileUrl && profileUrl.includes('/people/')) {
        results.push({ name, profileUrl });
      }
    });

    if (results.length === 0) {
      return res.json({ message: "❗ No profiles found matching that username." });
    }

    res.json({ profiles: results.slice(0, 5) }); // Return top 5
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
