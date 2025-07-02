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

    let verdict = "Likely real";
    let reason = "Profile appears normal.";

    const title = $('title').text();
    const hasPhoto = $('img').length > 0;
    const isRandomName = /[0-9]{5,}/.test(url);
    const hasFriends = $('div').text().toLowerCase().includes('friends');

    if (!hasPhoto) {
      verdict = "Suspicious";
      reason = "Profile has no photos.";
    }
    if (isRandomName) {
      verdict = "Likely fake";
      reason = "Username contains random numbers.";
    }
    if (!hasFriends) {
      verdict = "Suspicious";
      reason = "No friends info detected.";
    }

    res.json({ verdict, reason });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch or analyze profile. May be private or blocked." });
  }
});
