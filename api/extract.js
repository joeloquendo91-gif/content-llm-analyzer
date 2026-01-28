// api/extract.js (CommonJS - safest for Vercel)
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

module.exports = async function handler(req, res) {
  try {
    const url = req.query && req.query.url;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing ?url=" });
    }

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const resp = await fetch(parsed.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ContentLLMAnalyzer/1.0; +https://vercel.app)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    const contentType = resp.headers.get("content-type") || "";
    const status = resp.status;
    const html = await resp.text();

    if (!resp.ok) {
      return res.status(status).json({
        error: `Upstream fetch failed: HTTP ${status}`,
        contentType,
        sample: html.slice(0, 300),
      });
    }

    if (!contentType.includes("text/html")) {
      return res.status(415).json({
        error: `Unsupported content-type: ${contentType}`,
        contentType,
      });
    }

    const cappedHtml = html.slice(0, 1_500_000); // 1.5MB cap
    const dom = new JSDOM(cappedHtml, { url: parsed.toString() });
    const doc = dom.window.document;

    doc
      .querySelectorAll(
        "script, style, nav, header, footer, aside, iframe, form, noscript"
      )
      .forEach((el) => el.remove());

    const headings = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6")]
      .map((node) => {
        const level = node.tagName.toLowerCase();
        const text = (node.textContent || "").replace(/\s+/g, " ").trim();
        return { level, text };
      })
      .filter((h) => h.text && h.text.length >= 3)
      .slice(0, 80);

    const reader = new Readability(doc);
    const article = reader.parse();

    const title =
      (article?.title || doc.querySelector("title")?.textContent || "").trim();

    const excerpt = (article?.excerpt || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 300);

    const text = (article?.textContent || doc.body?.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 50_000);

    if (!text || text.length < 100) {
      return res.status(422).json({
        error:
          "Fetched HTML but extracted very little readable text. Use Paste Content mode for this URL.",
        title,
        excerpt,
        headings,
      });
    }

    return res.status(200).json({
      url: parsed.toString(),
      title,
      excerpt,
      headings,
      text,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Serverless function crashed",
      message: err?.message || String(err),
    });
  }
};