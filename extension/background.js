const API_BASE = "https://content-llm-analyzer.vercel.app";

console.log('🚀 Background script loaded');

// ANALYZE message handler — used by the app to call the API
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

console.log('✅ Extension ready');