import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export default async function handler(req, res) {
  try {
    const url = req.query?.url;
    if (!url) {
      return res.status(400).json({ error: "Missing ?url=" });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ContentLLMAnalyzer/1.0)"
      }
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Upstream fetch failed (${response.status})` });
    }

    const html = await response.text();

    const dom = new JSDOM(html, { url });
    const document = dom.window.document;

    // Main article extraction
    const reader = new Readability(document);
    const article = reader.parse();

    // Extract headings from real DOM
    const headingNodes = Array.from(
      document.querySelectorAll("h1,h2,h3,h4,h5,h6")
    );

    const headings = headingNodes
      .map((h) => ({
        level: h.tagName.toLowerCase(),
        text: (h.textContent || "").replace(/\s+/g, " ").trim(),
      }))
      .filter((h) => h.text.length > 0);

    return res.status(200).json({
      title: article?.title || document.title || "",
      excerpt: article?.excerpt || "",
      text: (article?.textContent || "").replace(/\s+/g, " ").trim(),
      headings,
    });
  } catch (err) {
    console.error("extract API error:", err);
    return res.status(500).json({
      error: err?.message || "Server error"
    });
  }
}