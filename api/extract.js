import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

function cleanHeadingText(el) {
  const clone = el.cloneNode(true);

  // Remove common "junk" that appears inside headings (esp. Wikipedia)
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

// NEW: More aggressive extraction that tries multiple strategies
function extractHeadingsMultiStrategy(document, articleContent) {
  let headings = [];
  
  // Strategy 1: From Readability article HTML (best for main content)
  if (articleContent) {
    const articleDom = new JSDOM(articleContent);
    headings = extractHeadings(articleDom.window.document);
  }
  
  // Strategy 2: If we got good headings (5+), use them
  if (headings.length >= 5) {
    return headings;
  }
  
  // Strategy 3: Try common main content containers
  const contentSelectors = [
    'main',
    'article',
    '[role="main"]',
    '#main-content',
    '#content',
    '.main-content',
    '.content',
    '#mw-content-text', // Wikipedia
  ];
  
  for (const selector of contentSelectors) {
    const container = document.querySelector(selector);
    if (container) {
      const containerHeadings = extractHeadings(container);
      if (containerHeadings.length > headings.length) {
        headings = containerHeadings;
      }
    }
  }
  
  // Strategy 4: If still not enough, extract from full document
  if (headings.length < 3) {
    const allHeadings = extractHeadings(document);
    
    // Filter out likely navigation/footer headings
    const filtered = allHeadings.filter(h => {
      const text = h.text.toLowerCase();
      // Skip common nav/footer headings
      const skipPatterns = [
        /^menu$/,
        /^navigation$/,
        /^skip to/,
        /^search$/,
        /^footer$/,
        /^header$/,
        /^sidebar$/,
        /^related (posts|articles|links)$/,
        /^share this/,
        /^follow us$/,
        /^contact us$/
      ];
      
      return !skipPatterns.some(pattern => pattern.test(text));
    });
    
    // Use filtered headings if we got more than before
    if (filtered.length > headings.length) {
      headings = filtered;
    }
  }
  
  return headings;
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

    // Extract headings using multi-strategy approach
    const headings = extractHeadingsMultiStrategy(document, article?.content);

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