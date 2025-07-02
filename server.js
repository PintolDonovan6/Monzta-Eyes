const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/analyze', async (req, res) => {
  const url = req.query.url;

  if (!url || !url.includes('facebook.com')) {
    return res.status(400).json({ error: 'Invalid Facebook profile URL' });
  }

  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(data);
    const title = $('title').text() || 'Unknown';
    const profilePic = $('img').first().attr('src');
    const hasFriends = $('div').text().toLowerCase().includes('friends');
    const randomNumbers = /[0-9]{4,}/.test(url);

    let verdict = 'Likely real';
    let reason = 'Profile appears normal.';

    if (!hasFriends) {
      verdict = 'Suspicious';
      reason = 'Could not detect friends or public info.';
    }

    if (randomNumbers) {
      verdict = 'Likely fake';
      reason = 'Profile URL contains unusual numbers.';
    }

    if (!profilePic) {
      verdict = 'Suspicious';
      reason = 'No profile photo detected.';
    }

    res.json({ verdict, reason, profilePic, title, url });
  } catch (err) {
    res.status(500).json({ error: "Could not analyze this profile. It may be private or blocked." });
  }
});

app.listen(PORT, () => {
  console.log(`Monzta Eyes running on port ${PORT}`);
});
