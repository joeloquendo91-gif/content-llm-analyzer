document.getElementById("open").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab?.url) {
      alert("Could not detect page URL");
      return;
    }

    const analyzerBase = "https://content-llm-analyzer.vercel.app";
    const targetUrl = encodeURIComponent(tab.url);

    chrome.tabs.create({
      url: `${analyzerBase}/?url=${targetUrl}`
    });
  } catch (err) {
    console.error("Extension error:", err);
    alert("Extension failed. Check console.");
  }
});