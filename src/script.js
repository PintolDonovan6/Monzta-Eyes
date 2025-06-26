function runCheck() {
  const input = document.getElementById("inputText").value.trim();
  const outputBox = document.getElementById("outputBox");

  if (!input) {
    outputBox.innerHTML = "❗ Please enter a name to check.";
    return;
  }

  const lower = input.toLowerCase();
  if (lower.includes("aid") || lower.includes("gov") || lower.match(/\d{3,}/)) {
    outputBox.innerHTML = `⚠️ <strong>Possible fake account</strong>: Be cautious, this name looks suspicious.`;
  } else {
    outputBox.innerHTML = `✅ <strong>Looks okay</strong>: No obvious signs of being fake.`;
  }
}
