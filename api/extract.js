import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

function cleanHeadingText(el) {
  const clone = el.cloneNode(true);

  // Remove common “junk” that appears inside headings (esp. Wikipedia)
  clone
    .querySelectorAll(
      ".mw-editsection, sup.reference, .reference, .noprint, .mw-anchor"
    )
    .forEach((n) => n.remove());

  return (clone.textContent || "").replace(/\s+/g, " ").trim();
}

function extractHeadings(root) {
  const nodes = Array.from(root.querySelectorAll("h1,h2,h3,h4,h5,h6"));

  const headings = nodes
    .map((el) => {
      const text = cleanHeadingText(el);
      if (!text || text.length < 2) return null;

      return {
        level: el.tagName.toLowerCase(),
        text,
      };
    })
    .filter(Boolean);

  // de-dupe
  const seen = new Set();
  return headings.filter((h) => {
    const key = `${h.level}::${h.text}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default async function handler(req, res) {
  try {
    const url = req.query?.url;
    if (!url) {
      return res.status(400).json({ error: "Missing ?url=" });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ContentLLMAnalyzer/1.0)",
      },
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

    // ---- HEADINGS: Readability-first, fallback to real DOM containers ----
    let headings = [];

    // 1) Try headings from Readability article HTML (best for “main content”)
    if (article?.content) {
      const articleDom = new JSDOM(article.content);
      headings = extractHeadings(articleDom.window.document);
    }

    // 2) Fallback: Wikipedia main content container
    if (!headings.length) {
      const wikiRoot = document.querySelector("#mw-content-text");
      headings = wikiRoot ? extractHeadings(wikiRoot) : extractHeadings(document);
    }

    return res.status(200).json({
      title: article?.title || document.title || "",
      excerpt: article?.excerpt || "",
      text: (article?.textContent || "").replace(/\s+/g, " ").trim(),
      headings,
    });
  } catch (err) {
    console.error("extract API error:", err);
    return res.status(500).json({
      error: err?.message || "Server error",
    });
  }
}