// popup.js

let extractedData = null;

// ─── Extract page content ───
async function extractPageData() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const title = document.title;

      const metaDesc = document.querySelector('meta[name="description"]');
      const description = metaDesc ? metaDesc.getAttribute('content') : '';

      const url = window.location.href;

      const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
        .map(el => {
          const clone = el.cloneNode(true);
          clone.querySelectorAll('button,svg,img,.icon,[aria-hidden="true"]').forEach(n => n.remove());
          return { level: el.tagName.toLowerCase(), text: clone.textContent.replace(/\s+/g, ' ').trim() };
        })
        .filter(h => h.text.length >= 2);

      // Introduction extraction
      function getIntro() {
        const selectors = ['article','main','[role="main"]','.main-content','.content','.article-content','.post-content','.entry-content'];
        let container = null;
        for (const s of selectors) { container = document.querySelector(s); if (container) break; }
        if (!container) container = document.body;

        container.querySelectorAll('nav,header,footer,aside,.sidebar,[role="navigation"],[role="banner"],[role="contentinfo"]')
          .forEach(el => el.setAttribute('data-skip', 'true'));

        const skipPatterns = [/find a center/i,/schedule now/i,/call \d/i,/^\d{3}-/,/^last updated/i,/^written by/i,/^table of contents/i,/^learn more about/i,/the .* difference/i,/^menu$/i,/^navigation$/i,/^copyright/i];

        const paras = Array.from(container.querySelectorAll('p'))
          .filter(p => !p.closest('[data-skip]'))
          .map(p => p.textContent.trim())
          .filter(t => t.length >= 80 && !skipPatterns.some(p => p.test(t)));

        let intro = '', wc = 0;
        for (const para of paras) {
          if (wc >= 120) break;
          const words = para.split(/\s+/);
          if (wc === 0) { intro = words.slice(0, 120).join(' '); wc = Math.min(words.length, 120); }
          else { const rem = 120 - wc; if (words.length <= rem) { intro += '\n\n' + para; wc += words.length; } }
        }

        if (wc < 30) {
          const h1 = document.querySelector('h1');
          if (h1) {
            let el = h1.nextElementSibling;
            while (el && wc < 120) {
              if (el.tagName === 'P' && el.textContent.trim().length > 50) { intro += (intro ? '\n\n' : '') + el.textContent.trim(); wc += el.textContent.trim().split(/\s+/).length; }
              if (/^H[1-6]$/.test(el.tagName)) break;
              el = el.nextElementSibling;
            }
          }
        }
        return intro || 'No introduction found.';
      }

      return { title, description, url, headings, introduction: getIntro(), text: document.body.innerText.replace(/\s+/g, ' ').trim() };
    }
  });

  return results[0].result;
}

// ─── Badge helpers ───
function setBadge(el, elText, text, type) {
  elText.textContent = text;
  el.className = 'badge badge-' + type;
}

// ─── Render extracted data ───
function render(data) {
  extractedData = data;

  // Title
  document.getElementById('titleValue').textContent = data.title || 'No title found';
  const tLen = (data.title || '').length;
  if (tLen >= 30 && tLen <= 60) setBadge(document.getElementById('titleBadge'), document.getElementById('titleBadgeText'), tLen + ' chars', 'good');
  else if (tLen > 0)            setBadge(document.getElementById('titleBadge'), document.getElementById('titleBadgeText'), tLen + ' chars', 'warn');
  else                          setBadge(document.getElementById('titleBadge'), document.getElementById('titleBadgeText'), 'Missing', 'miss');

  // Description
  document.getElementById('descValue').textContent = data.description || 'No meta description found';
  const dLen = (data.description || '').length;
  if (dLen >= 120 && dLen <= 160) setBadge(document.getElementById('descBadge'), document.getElementById('descBadgeText'), dLen + ' chars', 'good');
  else if (dLen > 0)             setBadge(document.getElementById('descBadge'), document.getElementById('descBadgeText'), dLen + ' chars', 'warn');
  else                           setBadge(document.getElementById('descBadge'), document.getElementById('descBadgeText'), 'Missing', 'miss');

  // URL
  document.getElementById('urlValue').textContent = data.url;

  // Headings
  const list = document.getElementById('headingsList');
  if (data.headings && data.headings.length > 0) {
    setBadge(document.getElementById('headingsBadge'), document.getElementById('headingsBadgeText'), data.headings.length + ' found', 'good');
    list.innerHTML = data.headings.map(h =>
      `<div class="heading-item ${h.level === 'h1' ? 'is-h1' : ''}">
        <span class="heading-tag tag-${h.level}">${h.level.toUpperCase()}</span>
        <span class="heading-text">${escapeHtml(h.text)}</span>
      </div>`
    ).join('');
  } else {
    setBadge(document.getElementById('headingsBadge'), document.getElementById('headingsBadgeText'), 'None', 'miss');
    list.innerHTML = '<div style="font-size:12px;color:#535a70;padding:4px 0;">No headings found on this page</div>';
  }

  // Header badge
  document.getElementById('headingCount').textContent = (data.headings?.length || 0) + ' headings';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── Analyze button ───
document.getElementById('analyzeBtn').addEventListener('click', async () => {
  if (!extractedData) return;

  document.getElementById('loadingOverlay').classList.add('active');

  try {
    const appUrl = 'https://content-llm-analyzer.vercel.app?source=extension';
    const newTab = await chrome.tabs.create({ url: appUrl });

    // Keep trying to inject until the app confirms it read the data
    let injected = false;
    let attempts = 0;
    const maxAttempts = 30; // 30 × 200ms = 6 seconds

    const tryInject = () => {
      if (injected || attempts >= maxAttempts) return;
      attempts++;

      chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        func: (d) => {
          // Write data
          localStorage.setItem('clmExtensionData', JSON.stringify(d));
          // Check if app already consumed it (it removes the key after reading)
          // Return whether the key is still there — if yes, app hasn't read it yet
          return !!localStorage.getItem('clmExtensionData');
        },
        args: [extractedData]
      }, (results) => {
        if (chrome.runtime.lastError) {
          // Page not ready yet, retry
          setTimeout(tryInject, 200);
          return;
        }

        const keyStillThere = results?.[0]?.result;

        if (keyStillThere) {
          // Data written, now poll to see if the app consumed it
          pollForConsumption();
        } else {
          // Key already gone — app already read and removed it
          injected = true;
          window.close();
        }
      });
    };

    // Poll to check if app has consumed (removed) the localStorage key
    const pollForConsumption = () => {
      chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        func: () => {
          return !!localStorage.getItem('clmExtensionData');
        }
      }, (results) => {
        if (chrome.runtime.lastError) {
          // Tab might have navigated, just close
          window.close();
          return;
        }

        const keyStillThere = results?.[0]?.result;

        if (!keyStillThere) {
          // App consumed the data — safe to close
          injected = true;
          window.close();
        } else {
          // Still there, keep polling
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(pollForConsumption, 200);
          } else {
            // Timeout — close anyway, data is in localStorage
            window.close();
          }
        }
      });
    };

    // Start injection attempts
    setTimeout(tryInject, 500); // Small delay for tab to start loading

  } catch (err) {
    document.getElementById('loadingOverlay').classList.remove('active');
    const box = document.getElementById('errorBox');
    box.textContent = err.message || 'Something went wrong';
    box.classList.add('active');
  }
});

// ─── Init ───
(async () => {
  try {
    const data = await extractPageData();
    render(data);
  } catch (err) {
    console.error(err);
    const box = document.getElementById('errorBox');
    box.textContent = 'Failed to extract page data. Make sure you are on a valid web page.';
    box.classList.add('active');
  }
})();