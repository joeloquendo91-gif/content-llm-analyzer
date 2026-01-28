// api/extract.js
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export const config = {
  runtime: "nodejs",
};

function cleanText(s = "") {
  return s.replace(/\s+/g, " ").trim();
}

function collectHeadings(doc) {
  const nodes = Array.from(doc.querySelectorAll("h1,h2,h3,h4,h5,h6"));
  return nodes
    .map((n) => ({
      level: n.tagName.toLowerCase(),
      text: cleanText(n.textContent || ""),
    }))
    .filter((h) => h.text.length > 0);
}

export default async function handler(req, res) {
  try {
    const url = req.query?.url;

    if (!url) {
      return res.status(400).json({ error: "Missing ?url=" });
    }

    // Basic safety: only allow http/https
    if (!/^https?:\/\//i.test(url)) {
      return res.status(400).json({ error: "URL must start with http:// or https://" });
    }

    const r = await fetch(url, {
      redirect: "follow",
      headers: {
        // Some sites block generic requests; this helps
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
        "accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!r.ok) {
      return res.status(r.status).json({
        error: `Upstream fetch failed: HTTP ${r.status}`,
      });
    }

    const html = await r.text();
    if (!html || html.length < 100) {
      return res.status(500).json({ error: "Fetched HTML was empty/too short" });
    }

    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    // Remove obvious junk before readability
    doc.querySelectorAll("script,style,noscript,iframe,form,nav,footer,header,aside").forEach((el) => el.remove());

    const headings = collectHeadings(doc);

    // Readability for main content
    const reader = new Readability(doc);
    const article = reader.parse();

    const title = cleanText(article?.title || doc.title || "");
    const excerpt = cleanText(article?.excerpt || "");
    const text = cleanText(article?.textContent || doc.body?.textContent || "");

    return res.status(200).json({
      title,
      excerpt,
      headings,
      text: text.slice(0, 50000),
    });
  } catch (e) {
    return res.status(500).json({
      error: e?.message || "Server error",
    });
  }
}