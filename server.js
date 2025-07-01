<!DOCTYPE html>
<html>
<head>
  <title>Monzta Eyes - Facebook Profile Finder</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 30px; }
    input, button { padding: 10px; font-size: 16px; }
    button { margin-left: 10px; }
    ul { padding: 0; list-style: none; }
    li { margin: 10px 0; }
  </style>
</head>
<body>
  <h2>🔒 Enter Secret Token to Unlock Search</h2>
  <input id="token" placeholder="Enter your secret token" />
  <button onclick="unlock()">Unlock</button>

  <div id="searchSection" style="display:none;">
    <h2>🔎 Search Facebook Profiles</h2>
    <input id="username" placeholder="Enter Facebook name" />
    <button onclick="search()">Search</button>
    <ul id="results"></ul>
  </div>

  <script>
    let userToken = '';

    function unlock() {
      const inputToken = document.getElementById('token').value.trim();
      if (!inputToken) {
        alert('Enter your secret token');
        return;
      }
      userToken = inputToken;
      document.getElementById('token').style.display = 'none';
      event.target.style.display = 'none';
      document.getElementById('searchSection').style.display = 'block';
      alert('Access granted');
    }

    async function search() {
      const name = document.getElementById('username').value.trim();
      const resultsEl = document.getElementById('results');
      resultsEl.innerHTML = "Loading...";

      if (!name) {
        resultsEl.innerHTML = '<li>Please enter a Facebook name</li>';
        return;
      }

      try {
        const res = await fetch(`https://monzta-eyes.onrender.com/search?username=${encodeURIComponent(name)}&token=${encodeURIComponent(userToken)}`);
        const data = await res.json();

        resultsEl.innerHTML = "";

        if (data.error) {
          resultsEl.innerHTML = `<li>Error: ${data.error}</li>`;
          return;
        }
        if (data.message) {
          resultsEl.innerHTML = `<li>${data.message}</li>`;
          return;
        }

        data.profiles.forEach(profile => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="${profile.profileUrl}" target="_blank">${profile.name}</a>`;
          resultsEl.appendChild(li);
        });
      } catch (e) {
        resultsEl.innerHTML = `<li>❌ Failed to fetch profiles.</li>`;
      }
    }
  </script>
</body>
</html>
