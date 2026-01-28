import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const UA =
  "Mozilla/5.0 (compatible; ContentLLMAnalyzer/1.0; +https://content-llm-analyzer.vercel.app)";

// (4) Junk kill-switch selectors (tweak anytime)
const JUNK_SELECTORS = [
  "script",
  "style",
  "nav",
  "header",
  "footer",
  "aside",
  "iframe",
  "form",
  "noscript",

  // common “not main content” blocks:
  ".toc",
  ".table-of-contents",
  ".related",
  ".related-articles",
  ".recommended",
  ".newsletter",
  ".subscribe",
  ".social",
  ".share",
  ".sharing",
  ".promo",
  ".advert",
  ".ads",
  ".ad",
  '[class*="share"]',
  '[class*="social"]',
  '[aria-label*="share"]',
  '[id*="share"]',
];

function cleanText(s = "") {
  return s.replace(/\s+/g, " ").trim();
}

function extractHeadings(doc) {
  // Pull headings IN ORDER from extracted article DOM
  const nodes = [...doc.querySelectorAll("h1,h2,h3")];

  const headings = nodes
    .map((h) => ({
      level: h.tagName.toLowerCase(), // "h1" | "h2" | "h3"
      text: cleanText(h.textContent || ""),
    }))
    .filter((h) => h.text.length > 0);

  // De-dupe consecutive duplicates (common with sticky headers)
  const deduped = [];
  for (const h of headings) {
    const prev = deduped[deduped.length - 1];
    if (!prev || prev.text !== h.text || prev.level !== h.level) deduped.push(h);
  }

  return deduped;
}

export default async function handler(req, res) {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    // Fetch raw HTML
    const r = await fetch(targetUrl, {
      headers: { "User-Agent": UA },
      redirect: "follow",
    });

    if (!r.ok) {
      return res.status(502).json({ error: `Fetch failed: HTTP ${r.status}` });
    }

    const html = await r.text();
    if (!html || html.length < 200) {
      return res.status(422).json({ error: "Fetched HTML is too short" });
    }

    // Load into JSDOM using the correct URL so Readability resolves relative links properly
    const dom = new JSDOM(html, { url: targetUrl });
    const rawDoc = dom.window.document;

    // Pre-clean obvious junk BEFORE readability
    rawDoc.querySelectorAll(JUNK_SELECTORS.join(",")).forEach((el) => el.remove());

    // (1) Readability isolate main article content
    const reader = new Readability(rawDoc);
    const article = reader.parse();

    if (!article?.content) {
      return res.status(422).json({
        error:
          "Could not extract main content with Readability. Try Paste mode or a different URL.",
      });
    }

    // Parse extracted article content
    const articleDom = new JSDOM(article.content);
    const doc = articleDom.window.document;

    // (4) Kill-switch cleanup INSIDE article too
    doc.querySelectorAll(JUNK_SELECTORS.join(",")).forEach((el) => el.remove());

    const headings = extractHeadings(doc);

    const text = cleanText(doc.body?.textContent || "");
    if (text.length < 200) {
      return res.status(422).json({
        error:
          "Extracted page but got very little text. Try Paste Content mode (or the page is JS-rendered).",
      });
    }

    return res.status(200).json({
      url: targetUrl,
      title: cleanText(article.title || ""),
      excerpt: cleanText(article.excerpt || ""),
      byline: cleanText(article.byline || ""),
      headings,
      text: text.slice(0, 50000),
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Unknown server error" });
  }
}