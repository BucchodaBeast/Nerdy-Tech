const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/humanize", async (req, res) => {
  const { system, text } = req.body;

  if (!system || !text) {
    return res.status(400).json({ error: "Missing system or text" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: text }]
      })
    });

    const data = await response.json();
    const result = data.content.map(b => b.text || "").join("");
    res.json({ result });

  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Nerdy Techy API running on port " + PORT));
