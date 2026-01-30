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

// NEW: Extract ALL headings from raw HTML, then intelligently filter
function extractAllHeadings(document) {
  // Step 1: Get EVERY heading from the page
  const allHeadings = extractHeadings(document);
  
  if (allHeadings.length === 0) {
    return [];
  }
  
  // Step 2: Identify likely navigation/footer headings to exclude
  const likelyNavFooter = new Set();
  
  allHeadings.forEach((heading, index) => {
    const text = heading.text.toLowerCase();
    
    // Pattern 1: Common nav/footer text
    const navFooterPatterns = [
      /^menu$/,
      /^navigation$/,
      /^skip to/,
      /^search$/,
      /^footer$/,
      /^header$/,
      /^sidebar$/,
      /^follow us$/,
      /^contact us$/,
      /^privacy preference/,
      /^manage consent/,
      /^vendors? list$/,
      /^cookie (settings|preferences)/,
      /^strictly necessary$/,
      /^analytics$/,
      /^advertising$/,
      /^social media$/,
    ];
    
    // Pattern 2: Common footer categories (often appear together)
    const footerCategories = [
      'about us',
      'contact',
      'privacy',
      'terms',
      'careers',
      'legal',
      'sitemap',
    ];
    
    // If matches nav/footer pattern, mark it
    if (navFooterPatterns.some(pattern => pattern.test(text))) {
      likelyNavFooter.add(index);
      return;
    }
    
    // Pattern 3: If it's part of a cluster of footer-y headings
    // (e.g., "About us", "Terms", "Privacy" appearing together)
    if (footerCategories.some(cat => text.includes(cat))) {
      // Check if there are other footer headings nearby (within 5 positions)
      const nearbyFooterCount = allHeadings
        .slice(Math.max(0, index - 5), Math.min(allHeadings.length, index + 6))
        .filter(h => footerCategories.some(cat => h.text.toLowerCase().includes(cat)))
        .length;
      
      // If 3+ footer-category headings are clustered together, likely footer section
      if (nearbyFooterCount >= 3) {
        likelyNavFooter.add(index);
      }
    }
  });
  
  // Step 3: Remove nav/footer headings
  const contentHeadings = allHeadings.filter((_, index) => !likelyNavFooter.has(index));
  
  // Step 4: If we filtered out too much (left with < 3 headings), be less aggressive
  if (contentHeadings.length < 3 && allHeadings.length >= 3) {
    // Only remove the obvious ones (strict patterns only)
    const strictFiltered = allHeadings.filter(h => {
      const text = h.text.toLowerCase();
      return !(
        text === 'menu' ||
        text === 'navigation' ||
        text === 'footer' ||
        text === 'header' ||
        text.startsWith('skip to') ||
        text === 'privacy preference center' ||
        text === 'manage consent preferences' ||
        text === 'vendors list'
      );
    });
    return strictFiltered;
  }
  
  return contentHeadings;
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

    // Main article extraction (for title, excerpt, text)
    const reader = new Readability(document);
    const article = reader.parse();

    // CRITICAL: Extract headings from RAW HTML BEFORE Readability filters anything
    // This ensures we capture ALL on-page headings, then filter intelligently
    const headings = extractAllHeadings(document);

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