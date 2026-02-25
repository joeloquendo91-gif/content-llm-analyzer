export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { prompt, model = "claude-sonnet-4-20250514", max_tokens = 8000 } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || "Anthropic error", data });

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}