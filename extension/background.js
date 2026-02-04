const API_BASE = "https://content-llm-analyzer.vercel.app";

console.log('🚀 Background script loaded');

// ANALYZE handler — used by the app to call the API
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

// Function to extract content - runs in page context
function extractPageContent() {
  const title = document.title;
  const url = window.location.href;

  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    .map(el => {
      const clone = el.cloneNode(true);
      clone.querySelectorAll('button, svg, img, .icon, [aria-hidden="true"]').forEach(n => n.remove());
      const text = clone.textContent.replace(/\s+/g, ' ').trim();
      return { level: el.tagName.toLowerCase(), text: text };
    })
    .filter(h => h.text && h.text.length >= 2);

  function extractIntroduction() {
    const contentSelectors = ['article','main','[role="main"]','.main-content','.content','.article-content','.post-content','.entry-content'];
    let mainContent = null;
    for (const selector of contentSelectors) {
      mainContent = document.querySelector(selector);
      if (mainContent) break;
    }
    if (!mainContent) mainContent = document.body;

    mainContent.querySelectorAll('nav,header,footer,aside,.sidebar,[role="navigation"],[role="banner"],[role="contentinfo"]')
      .forEach(el => el.setAttribute('data-skip', 'true'));

    const skipPatterns = [/find a center/i,/schedule now/i,/call \d/i,/^\d{3}-/,/^last updated/i,/^written by/i,/^table of contents/i,/^learn more about/i,/the .* difference/i,/^menu$/i,/^navigation$/i,/^copyright/i];

    const paragraphs = Array.from(mainContent.querySelectorAll('p'))
      .filter(p => !p.closest('[data-skip]'))
      .map(p => p.textContent.trim())
      .filter(text => text.length >= 80 && !skipPatterns.some(p => p.test(text)));

    let introduction = '', wordCount = 0;
    for (const para of paragraphs) {
      if (wordCount >= 120) break;
      const words = para.split(/\s+/);
      if (wordCount === 0) { introduction = words.slice(0, 120).join(' '); wordCount = Math.min(words.length, 120); }
      else { const rem = 120 - wordCount; if (words.length <= rem) { introduction += '\n\n' + para; wordCount += words.length; } }
    }

    if (wordCount < 30) {
      const h1 = document.querySelector('h1');
      if (h1) {
        let el = h1.nextElementSibling;
        while (el && wordCount < 120) {
          if (el.tagName === 'P' && el.textContent.trim().length > 50) { introduction += (introduction ? '\n\n' : '') + el.textContent.trim(); wordCount += el.textContent.trim().split(/\s+/).length; }
          if (/^H[1-6]$/.test(el.tagName)) break;
          el = el.nextElementSibling;
        }
      }
    }
    return introduction || 'No introduction found.';
  }

  const introduction = extractIntroduction();
  const contentText = document.body.innerText.replace(/\s+/g, ' ').trim();

  return { title, url, headings, introduction, text: contentText };
}

// Click handler — extracts, opens app, injects via localStorage
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

      const appUrl = `${API_BASE}?source=extension`;
      chrome.tabs.create({ url: appUrl }, (newTab) => {
        console.log('✅ Opened new tab:', newTab.id);

        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            func: (data) => {
              localStorage.setItem('clmExtensionData', JSON.stringify(data));
              console.log('✅ Stored extension data in localStorage:', data.headings.length, 'headings');
              window.dispatchEvent(new Event('storage'));
            },
            args: [extracted]
          });
        }, 1000);
      });
    }
  });
});

console.log('✅ Extension ready');