// Sample data of profiles matching usernames
const profiles = [
  {
    id: 1,
    username: "PNG_Gov_Aid_5050",
    image: "https://i.imgur.com/aich1.png",
    followers: "2,300",
    about: "We offer free grants for PNG families. Apply now!"
  },
  {
    id: 2,
    username: "GovHelpPNG2024",
    image: "https://i.imgur.com/aich2.png",
    followers: "5,120",
    about: "Claim K1000. Only today. Send phone number."
  },
  {
    id: 3,
    username: "PNG_Grants_Office",
    image: "https://i.imgur.com/aich3.png",
    followers: "980",
    about: "Helping citizens of PNG with food & cash."
  }
];

// Search and display matching profiles
function runCheck() {
  const input = document.getElementById("inputText").value.toLowerCase().trim();
  const outputBox = document.getElementById("outputBox");
  outputBox.innerHTML = "";

  if (!input) {
    outputBox.innerHTML = "<p>❗ Please enter a username to check.</p>";
    return;
  }

  const matchedProfiles = profiles.filter(p => p.username.toLowerCase().includes(input));

  if (matchedProfiles.length === 0) {
    outputBox.innerHTML = "<p>❗ No matching profiles found.</p>";
    return;
  }

  matchedProfiles.forEach(profile => {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.innerHTML = `
      <img src="${profile.image}" alt="${profile.username}" />
      <div class="info">
        <h3>${profile.username}</h3>
        <p>${profile.about}</p>
        <p><strong>Followers:</strong> ${profile.followers}</p>
        <button onclick="checkProfile('${profile.username}')">Run Aich Check</button>
      </div>
    `;
    outputBox.appendChild(card);
  });
}

// Check selected profile and show result
function checkProfile(username) {
  const outputBox = document.getElementById("outputBox");
  outputBox.innerHTML = `
    <div class="check-result">
      <h3>🛑 Aich Check Result for "${username}"</h3>
      <p>⚠️ This account shows signs of being <strong>FAKE or FRAUDULENT</strong>.</p>
      <p>Please report it and do not send money or personal details.</p>
      <button onclick="runCheck()">Back to Search</button>
    </div>
  `;
}
