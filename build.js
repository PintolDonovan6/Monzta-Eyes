const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/search', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.4430.212 Safari/537.36"
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.4430.212 Safari/537.36");

    const searchUrl = `https://www.facebook.com/search/people?q=${encodeURIComponent(username)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // wait for results to load
    await page.waitForTimeout(5000);

    const profiles = await page.evaluate(() => {
      const results = [];
      const items = document.querySelectorAll('a[href*="facebook.com/"][role="link"]');

      for (let i = 0; i < items.length && results.length < 5; i++) {
        const link = items[i].getAttribute('href');
        const name = items[i].innerText.trim();

        if (link && name && link.includes('/profile.php') || link.includes('/people/') || link.includes('facebook.com/') && !link.includes('search')) {
          results.push({
            name,
            profileUrl: link.startsWith('http') ? link : `https://www.facebook.com${link}`
          });
        }
      }

      return results;
    });

    await browser.close();

    if (profiles.length === 0) {
      return res.status(404).json({ message: '❗ No profiles found matching that username.' });
    }

    return res.json({ profiles });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 AichCheck backend running on port ${PORT}`);
});
