import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

app.post("/api/analyze", async (req, res) => {
  const { prompt } = req.body

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error("Erreur serveur:", err)
    res.status(500).json({ error: "Erreur serveur" })
  }
})

app.listen(3001, () => console.log("✅ Serveur proxy sur http://localhost:3001"))