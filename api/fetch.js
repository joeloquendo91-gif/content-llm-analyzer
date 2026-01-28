export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing ?url=" });

    // Basic validation
    let target;
    try {
      target = new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }

    if (!["http:", "https:"].includes(target.protocol)) {
      return res.status(400).json({ error: "Only http/https allowed" });
    }

    const response = await fetch(target.toString(), {
      headers: {
        // Helps some sites return normal HTML
        "User-Agent":
          "Mozilla/5.0 (compatible; ContentAnalyzerBot/1.0; +https://vercel.com)",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Upstream HTTP ${response.status}`,
      });
    }

    const html = await response.text();
    return res.status(200).json({ html });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}