export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { url, extraction, content, intendedPrimary, intendedSecondary } = req.body || {};
    if (!content || typeof content !== "string" || content.length < 50) {
      return res.status(400).json({ error: "Missing or invalid content" });
    }

    // ---- Google NLP (optional) ----
    let nlpResults = {
      primaryCategory: null,
      secondaryCategory: null,
      clarityGap: 0,
      alignmentStatus: "No categories detected"
    };

    const googleKey = process.env.GOOGLE_API_KEY;
    if (googleKey) {
      const gRes = await fetch(
        `https://language.googleapis.com/v1/documents:classifyText?key=${googleKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            document: { type: "PLAIN_TEXT", content: content.slice(0, 20000) }
          })
        }
      );

      if (gRes.ok) {
        const gData = await gRes.json();
        const cats = Array.isArray(gData.categories) ? gData.categories : [];
        const sorted = cats.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
        const primary = sorted[0] || null;
        const secondary = sorted[1] || null;
        const clarityGap = primary && secondary ? (primary.confidence - secondary.confidence) : (primary?.confidence || 0);

        let alignmentStatus = "Misaligned";
        if (clarityGap >= 0.3) alignmentStatus = "Aligned";
        else if (clarityGap >= 0.15) alignmentStatus = "Mixed (Acceptable)";

        nlpResults = { primaryCategory: primary, secondaryCategory: secondary, clarityGap, alignmentStatus };
      }
    }

    const intentContext =
      intendedPrimary || intendedSecondary
        ? `\nTarget Primary Category: ${intendedPrimary || "(not specified)"}\nTarget Secondary Category: ${intendedSecondary || "(not specified)"}`
        : "";

    // ---- Claude prompt (use your improved version here) ----
    const prompt = `
You are an expert in content intent interpretation and grounding for AI and search systems.
Evaluate how the page is currently understood, identify mixed or competing signals, and recommend light, non-destructive edits.

INPUTS
URL: ${url || "(unknown)"}
Google NLP:
- Primary: ${nlpResults.primaryCategory ? `${nlpResults.primaryCategory.name} (${(nlpResults.primaryCategory.confidence * 100).toFixed(1)}%)` : "None"}
- Secondary: ${nlpResults.secondaryCategory ? `${nlpResults.secondaryCategory.name} (${(nlpResults.secondaryCategory.confidence * 100).toFixed(1)}%)` : "None"}
- Clarity gap: ${(nlpResults.clarityGap * 100).toFixed(1)}%
${intentContext}

EXTRACTED STRUCTURE (do not guess headings)
Title: ${extraction?.title || ""}
Outline:
${(extraction?.headings || []).slice(0, 30).map(h => `${String(h.level || "").toUpperCase()}: ${h.text || ""}`).join("\n") || "(none)"}

CONTENT (truncated):
${content.slice(0, 25000)}

Return JSON ONLY (no markdown).
Include up to 6 suggested edits.
Schema:
{
  "categoryMatchStatus": "PRIMARY MATCH|WRONG PRIORITY|PRIMARY MISMATCH|No intent specified",
  "groundingScore": 0-100,
  "groundingExplanation": "1–4 sentences",
  "currentInterpretationSummary": "A. 1–2 sentences",
  "intentAlignmentAssessment": {"status":"Aligned|Partially aligned|Mixed","reason":"B. 1–3 sentences"},
  "topMixedSignals": ["C. ..."],
  "highestImpactEdit": {"location":"...","change":"...","why":"..."},
  "suggestedEdits": [{"location":"...","change":"...","reason":"..."}],
  "expectedOutcome": "E. 1–2 sentences"
}
`;

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return res.status(500).json({ error: "Missing ANTHROPIC_API_KEY env var" });
    }

    const aRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2500,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const aText = await aRes.text();
    let aJson;
    try {
      aJson = JSON.parse(aText);
    } catch {
      return res.status(500).json({ error: `Claude returned non-JSON: ${aText.slice(0, 200)}` });
    }

    if (!aRes.ok) {
      return res.status(500).json({ error: aJson?.error?.message || "Claude API error" });
    }

    const textBlock = aJson?.content?.find((c) => c.type === "text")?.text || "";
    const match = textBlock.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(500).json({ error: "Could not parse JSON from Claude response" });
    }

    const claude = JSON.parse(match[0]);

    return res.status(200).json({
      nlp: nlpResults,
      claude
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
