const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter q' });
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Facebook search URL for people search
    const searchUrl = `https://www.facebook.com/search/people/?q=${encodeURIComponent(query)}`;

    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Wait for search results container
    await page.waitForSelector('[aria-label="Search Results"]', { timeout: 10000 });

    // Extract profiles
    const profiles = await page.evaluate(() => {
      const profileNodes = Array.from(document.querySelectorAll('[aria-label="Search Results"] a[href*="facebook.com"]'));
      const results = [];

      for (let node of profileNodes) {
        const href = node.href;
        const name = node.querySelector('span')?.innerText || '';
        const img = node.querySelector('img')?.src || null;
        if (name && href) {
          results.push({
            name,
            profileUrl: href,
            image: img
          });
        }
        if (results.length >= 5) break;
      }
      return results;
    });

    await browser.close();

    if (!profiles.length) {
      return res.json({ message: 'No profiles found' });
    }

    return res.json(profiles);

  } catch (err) {
    console.error('Error scraping Facebook:', err);
    return res.status(500).json({ error: 'Failed to scrape Facebook' });
  }
});

app.listen(PORT, () => {
  console.log(`Facebook profile scraper API running on port ${PORT}`);
});
