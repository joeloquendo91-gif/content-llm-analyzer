function extractHeadings() {
  return Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"))
    .map((h) => ({
      level: h.tagName.toLowerCase(),
      text: (h.textContent || "").replace(/\s+/g, " ").trim()
    }))
    .filter((h) => h.text.length);
}

function extractText() {
  const clone = document.body.cloneNode(true);

  clone
    .querySelectorAll("script, style, nav, header, footer, aside, iframe, form, noscript")
    .forEach((el) => el.remove());

  const text = (clone.textContent || "").replace(/\s+/g, " ").trim();
  return text.slice(0, 50000);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "EXTRACT_PAGE") {
    try {
      sendResponse({
        ok: true,
        data: {
          url: location.href,
          title: document.title || "",
          headings: extractHeadings(),
          text: extractText()
        }
      });
    } catch (e) {
      sendResponse({ ok: false, error: e?.message || "Extraction failed" });
    }
  }
});
