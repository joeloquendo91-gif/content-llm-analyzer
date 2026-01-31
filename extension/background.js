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

// Function to extract content - IMPROVED INTRODUCTION
function extractPageContent() {
  const title = document.title;
  const url = window.location.href;
  
  // Extract headings
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
  
  // IMPROVED: Extract introduction from main content area
  function extractIntroduction() {
    // Strategy 1: Try to find main content container
    const contentSelectors = [
      'article',
      'main',
      '[role="main"]',
      '.main-content',
      '.content',
      '.article-content',
      '.post-content',
      '.entry-content',
      '#content',
      '#main-content'
    ];
    
    let mainContent = null;
    for (const selector of contentSelectors) {
      mainContent = document.querySelector(selector);
      if (mainContent) break;
    }
    // If no main content found, use body (but skip nav/header/footer)
    if (!mainContent) {
      mainContent = document.body;
    }
    
    // Remove navigation, header, footer, sidebars from consideration
    const elementsToSkip = mainContent.querySelectorAll('nav, header, footer, aside, .sidebar, .navigation, .menu, [role="navigation"], [role="banner"], [role="contentinfo"]');
    elementsToSkip.forEach(el => el.setAttribute('data-skip-intro', 'true'));
    
    // Get all paragraph elements from main content
    const paragraphs = Array.from(mainContent.querySelectorAll('p'))
      .filter(p => {
        // Skip if parent is marked to skip
        if (p.closest('[data-skip-intro]')) return false;
        return true;
      })
      .map(p => p.textContent.trim())
      .filter(text => {
        // Filter out short paragraphs (likely navigation/footer)
        if (text.length < 80) return false;
        
        // Filter out common navigation/promotional text
        const skipPatterns = [
          /^menu$/i,
          /^navigation$/i,
          /^skip to/i,
          /^cookies?$/i,
          /^privacy policy$/i,
          /^terms/i,
          /^copyright/i,
          /^all rights reserved/i,
          /^share this/i,
          /^follow us/i,
          /find a center/i,
          /schedule now/i,
          /call \d{3}-\d{3}-\d{4}/i,
          /^\d{3}-\d{3}-\d{4}$/,
          /^last updated/i,
          /^written by/i,
          /^table of contents/i,
          /^learn more about/i,
          /the .* difference/i
        ];
        
        return !skipPatterns.some(pattern => pattern.test(text));
      });
    
    // Get first 2-3 substantial paragraphs (120-150 words total)
    let introduction = '';
    let wordCount = 0;
    const targetWords = 120;
    
    for (const para of paragraphs) {
      if (wordCount >= targetWords) break;
      
      const paraWords = para.split(/\s+/);
      const remainingWords = targetWords - wordCount;
      
      if (wordCount === 0) {
        // First paragraph - take all of it if under target
        if (paraWords.length <= targetWords) {
          introduction = para;
          wordCount = paraWords.length;
        } else {
          // First paragraph is too long, truncate
          introduction = paraWords.slice(0, targetWords).join(' ') + '...';
          wordCount = targetWords;
        }
      } else {
        // Subsequent paragraphs
        if (paraWords.length <= remainingWords) {
          introduction += '\n\n' + para;
          wordCount += paraWords.length;
        } else {
          introduction += '\n\n' + paraWords.slice(0, remainingWords).join(' ') + '...';
          wordCount = targetWords;
        }
      }
    }
    
    // Fallback: if we didn't get enough content, use a different strategy
    if (wordCount < 30) {
      // Try to find content after the first H1
      const h1 = document.querySelector('h1');
      if (h1) {
        let currentElement = h1.nextElementSibling;
        const contentParts = [];
        let words = 0;
        
        while (currentElement && words < 150) {
          if (currentElement.tagName === 'P' && currentElement.textContent.trim().length > 50) {
            const text = currentElement.textContent.trim();
            contentParts.push(text);
            words += text.split(/\s+/).length;
          }
          // Stop at next heading
          if (/^H[1-6]$/.test(currentElement.tagName)) {
            break;
          }
          currentElement = currentElement.nextElementSibling;
        }
        
        if (contentParts.length > 0) {
          introduction = contentParts.join('\n\n');
        }
      }
    }
    
    return introduction || 'No introduction content found.';
  }
  
  const introduction = extractIntroduction();
  
  // Get full text for analysis (but not for display)
  const contentText = document.body.innerText.replace(/\s+/g, ' ').trim();
  
  return {
    title,
    url,
    headings,
    introduction,
    text: contentText
  };
}

// Click handler
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
      
      // Open app first
      const appUrl = `${API_BASE}?source=extension`;
      chrome.tabs.create({ url: appUrl }, (newTab) => {
        console.log('✅ Opened new tab:', newTab.id);
        
        // Wait for the page to load, then inject the data
        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            func: (data) => {
              // Store in localStorage of the NEW tab
              localStorage.setItem('clmExtensionData', JSON.stringify(data));
              console.log('✅ Stored extension data in localStorage:', data.headings.length, 'headings');
              // Trigger a storage event
              window.dispatchEvent(new Event('storage'));
            },
            args: [extracted]
          });
        }, 1000); // Wait 1 second for page to load
      });
    }
  });
});

console.log('✅ Extension ready');