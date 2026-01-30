const API_BASE = "https://content-llm-analyzer.vercel.app";

console.log('🚀 Background script loaded');

// Your existing ANALYZE handler
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "ANALYZE") {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(msg.payload)
        });

        const text = await res.text();
        let data = null;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(`API did not return JSON (status ${res.status}). Response starts with: ${text.slice(0, 120)}`);
        }

        if (!res.ok) {
          throw new Error(data?.error || `Analyze failed (${res.status})`);
        }

        sendResponse({ ok: true, data });
      } catch (e) {
        sendResponse({ ok: false, error: e?.message || "Analyze request failed" });
      }
    })();

    return true;
  }
});

// Function to extract content
function extractPageContent() {
  const title = document.title;
  const url = window.location.href;
  
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    .map(el => {
      const clone = el.cloneNode(true);
      clone.querySelectorAll('button, svg, img, .icon, [aria-hidden="true"]').forEach(n => n.remove());
      const text = clone.textContent.replace(/\s+/g, ' ').trim();
      return {
        level: el.tagName.toLowerCase(),
        text: text
      };
    })
    .filter(h => h.text && h.text.length >= 2);
  
  const contentText = document.body.innerText.replace(/\s+/g, ' ').trim();
  const words = contentText.split(/\s+/);
  const introduction = words.slice(0, 250).join(' ') + (words.length > 250 ? '...' : '');
  
  return {
    title,
    url,
    headings,
    introduction,
    text: contentText
  };
}

// Click handler - NEW: Use sessionStorage instead
chrome.action.onClicked.addListener((tab) => {
  console.log('🎯 Extension icon clicked on:', tab.url);
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractPageContent
  }, (results) => {
    if (chrome.runtime.lastError) {
      console.error('❌ Script execution error:', chrome.runtime.lastError.message);
      return;
    }
    
    if (results && results[0] && results[0].result) {
      const extracted = results[0].result;
      console.log('✅ Extracted:', extracted.headings.length, 'headings');
      
      // Store data and inject script to pass it to the app
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (data) => {
          sessionStorage.setItem('extensionData', JSON.stringify(data));
        },
        args: [extracted]
      }, () => {
        // Open app - it will read from sessionStorage
        const appUrl = `${API_BASE}?source=extension`;
        chrome.tabs.create({ url: appUrl });
      });
    }
  });
});

console.log('✅ Extension ready');