import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export default async function handler(req, res) {
  try {
    const url = req.query?.url;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing ?url=" });
    }

    // Basic URL validation
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // Fetch HTML
    const resp = await fetch(parsed.toString(), {
      headers: {
        // Helps with some sites returning odd responses
        "User-Agent":
          "Mozilla/5.0 (compatible; ContentLLMAnalyzer/1.0; +https://vercel.app)",
        "Accept":
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

    // Hard cap to avoid huge pages crashing function
    const cappedHtml = html.slice(0, 1_500_000); // 1.5MB

    // Parse HTML in JSDOM
    const dom = new JSDOM(cappedHtml, { url: parsed.toString() });
    const doc = dom.window.document;

    // Remove junk before Readability
    doc
      .querySelectorAll(
        "script, style, nav, header, footer, aside, iframe, form, noscript"
      )
      .forEach((el) => el.remove());

    // Extract headings from DOM (more reliable than guessing from plain text)
    const headingNodes = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6")];
    const headings = headingNodes
      .map((node) => {
        const level = node.tagName.toLowerCase();
        const text = (node.textContent || "").replace(/\s+/g, " ").trim();
        return { level, text };
      })
      .filter((h) => h.text && h.text.length >= 3)
      .slice(0, 80); // keep it reasonable

    // Readability extraction
    const reader = new Readability(doc);
    const article = reader.parse();

    const title =
      (article?.title || doc.querySelector("title")?.textContent || "").trim();

    const excerpt =
      (article?.excerpt || "").replace(/\s+/g, " ").trim().slice(0, 300);

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
    // Always return JSON, never crash
    return res.status(500).json({
      error: "Serverless function crashed",
      message: err?.message || String(err),
      stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
    });
  }
}