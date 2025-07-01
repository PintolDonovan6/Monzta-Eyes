const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Your existing /search API route
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
      const name = $(el).text();
      const profileUrl = $(el).attr('href');
      if (name && profileUrl && profileUrl.startsWith('https://www.facebook.com/')) {
        results.push({ name, profileUrl });
      }
    });

    if (results.length === 0) {
      return res.json({ message: "❗ No profiles found matching that username." });
    }

    res.json({ profiles: results.slice(0, 5) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Facebook profiles" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
