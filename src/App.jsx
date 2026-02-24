import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, TrendingUp, Info, X } from 'lucide-react';
import { useEffect } from "react";

// Google NLP Content Categories
const GOOGLE_CATEGORIES = [
  "/Arts & Entertainment",
  "/Arts & Entertainment/Books & Literature",
  "/Arts & Entertainment/Celebrities & Entertainment News",
  "/Arts & Entertainment/Comics & Animation",
  "/Arts & Entertainment/Entertainment Industry",
  "/Arts & Entertainment/Events & Listings",
  "/Arts & Entertainment/Fun & Trivia",
  "/Arts & Entertainment/Humor",
  "/Arts & Entertainment/Movies",
  "/Arts & Entertainment/Music & Audio",
  "/Arts & Entertainment/Offbeat",
  "/Arts & Entertainment/Online Media",
  "/Arts & Entertainment/Performing Arts",
  "/Arts & Entertainment/TV & Video",
  "/Arts & Entertainment/Visual Art & Design",
  "/Autos & Vehicles",
  "/Autos & Vehicles/Commercial Vehicles",
  "/Autos & Vehicles/Motor Vehicles (By Type)",
  "/Autos & Vehicles/Vehicle Codes & Driving Laws",
  "/Autos & Vehicles/Vehicle Maintenance, Parts & Services",
  "/Autos & Vehicles/Vehicle Shopping",
  "/Beauty & Fitness",
  "/Beauty & Fitness/Beauty Services & Spas",
  "/Beauty & Fitness/Body Art",
  "/Beauty & Fitness/Fashion & Style",
  "/Beauty & Fitness/Fitness",
  "/Beauty & Fitness/Hair Care",
  "/Beauty & Fitness/Make-Up & Cosmetics",
  "/Beauty & Fitness/Skin & Nail Care",
  "/Beauty & Fitness/Weight Loss",
  "/Books & Literature",
  "/Books & Literature/Children's Literature",
  "/Books & Literature/E-Books",
  "/Books & Literature/Fan Fiction",
  "/Books & Literature/Poetry",
  "/Business & Industrial",
  "/Business & Industrial/Advertising & Marketing",
  "/Business & Industrial/Agriculture & Forestry",
  "/Business & Industrial/Business Finance",
  "/Business & Industrial/Business Operations",
  "/Business & Industrial/Business Services",
  "/Business & Industrial/Chemicals Industry",
  "/Business & Industrial/Construction & Maintenance",
  "/Business & Industrial/Energy & Utilities",
  "/Business & Industrial/Hospitality Industry",
  "/Business & Industrial/Industrial Materials & Equipment",
  "/Business & Industrial/Manufacturing",
  "/Business & Industrial/Metals & Mining",
  "/Business & Industrial/Pharmaceuticals & Biotech",
  "/Business & Industrial/Printing & Publishing",
  "/Business & Industrial/Retail Trade",
  "/Business & Industrial/Small Business",
  "/Business & Industrial/Textiles & Nonwovens",
  "/Business & Industrial/Transportation & Logistics",
  "/Computers & Electronics",
  "/Computers & Electronics/Computer Hardware",
  "/Computers & Electronics/Computer Security",
  "/Computers & Electronics/Consumer Electronics",
  "/Computers & Electronics/Electronics & Electrical",
  "/Computers & Electronics/Enterprise Technology",
  "/Computers & Electronics/Networking",
  "/Computers & Electronics/Programming",
  "/Computers & Electronics/Software",
  "/Finance",
  "/Finance/Accounting & Auditing",
  "/Finance/Banking",
  "/Finance/Credit & Lending",
  "/Finance/Financial Planning & Management",
  "/Finance/Grants, Scholarships & Financial Aid",
  "/Finance/Insurance",
  "/Finance/Investing",
  "/Finance/Tax Preparation & Planning",
  "/Food & Drink",
  "/Food & Drink/Beverages",
  "/Food & Drink/Cooking & Recipes",
  "/Food & Drink/Food & Grocery Retailers",
  "/Food & Drink/Restaurants",
  "/Games",
  "/Games/Arcade & Coin-Op Games",
  "/Games/Board Games",
  "/Games/Card Games",
  "/Games/Computer & Video Games",
  "/Games/Gambling",
  "/Games/Online Games",
  "/Games/Roleplaying Games",
  "/Games/Table Games",
  "/Hobbies & Leisure",
  "/Hobbies & Leisure/Clubs & Organizations",
  "/Hobbies & Leisure/Crafts",
  "/Hobbies & Leisure/Merit Prizes & Contests",
  "/Hobbies & Leisure/Outdoors",
  "/Hobbies & Leisure/Paintball",
  "/Hobbies & Leisure/Paintball/Airsoft",
  "/Hobbies & Leisure/Radio Control & Modeling",
  "/Hobbies & Leisure/Special Occasions",
  "/Hobbies & Leisure/Water Activities",
  "/Home & Garden",
  "/Home & Garden/Bed & Bath",
  "/Home & Garden/Gardening & Landscaping",
  "/Home & Garden/Home & Interior Decor",
  "/Home & Garden/Home Appliances",
  "/Home & Garden/Home Furnishings",
  "/Home & Garden/Home Improvement",
  "/Home & Garden/Home Safety & Security",
  "/Home & Garden/Kitchen & Dining",
  "/Home & Garden/Nursery & Playroom",
  "/Home & Garden/Parasites & Pest Control",
  "/Home & Garden/Pool & Spa",
  "/Home & Garden/Yard & Patio",
  "/Internet & Telecom",
  "/Internet & Telecom/Email & Messaging",
  "/Internet & Telecom/ISPs",
  "/Internet & Telecom/Mobile & Wireless",
  "/Internet & Telecom/Service Providers",
  "/Internet & Telecom/Teleconferencing",
  "/Internet & Telecom/Web Services",
  "/Jobs & Education",
  "/Jobs & Education/Education",
  "/Jobs & Education/Jobs",
  "/Law & Government",
  "/Law & Government/Government",
  "/Law & Government/Legal",
  "/Law & Government/Military",
  "/Law & Government/Public Safety",
  "/Law & Government/Social Services",
  "/News",
  "/News/Business News",
  "/News/Gossip & Tabloid News",
  "/News/Local News",
  "/News/Politics",
  "/News/Sports News",
  "/News/Technology News",
  "/News/Weather",
  "/News/World News",
  "/Online Communities",
  "/Online Communities/Dating & Personals",
  "/Online Communities/File Sharing & Hosting",
  "/Online Communities/Online Goodies",
  "/Online Communities/Photo & Image Sharing",
  "/Online Communities/Photo & Video Sharing",
  "/Online Communities/Social Networks",
  "/Online Communities/Virtual Worlds",
  "/People & Society",
  "/People & Society/Family & Relationships",
  "/People & Society/Kids & Teens",
  "/People & Society/Religion & Belief",
  "/People & Society/Romance",
  "/People & Society/Seniors & Retirement",
  "/People & Society/Social Issues & Advocacy",
  "/People & Society/Social Sciences",
  "/People & Society/Subcultures & Niche Interests",
  "/Pets & Animals",
  "/Pets & Animals/Animal Products & Services",
  "/Pets & Animals/Pets",
  "/Pets & Animals/Wildlife",
  "/Real Estate",
  "/Real Estate/Lots & Land",
  "/Real Estate/Property Development",
  "/Real Estate/Property Inspections & Appraisals",
  "/Real Estate/Property Management",
  "/Real Estate/Real Estate Listings",
  "/Real Estate/Timeshares & Vacation Properties",
  "/Reference",
  "/Reference/Educational Resources",
  "/Reference/Foreign Language Resources",
  "/Reference/General Reference",
  "/Reference/Geographic Reference",
  "/Reference/How-To, DIY & Expert Content",
  "/Reference/Language Resources",
  "/Reference/Public Records & Directories",
  "/Science",
  "/Science/Astronomy",
  "/Science/Biological Sciences",
  "/Science/Chemistry",
  "/Science/Computer Science",
  "/Science/Earth Sciences",
  "/Science/Ecology & Environment",
  "/Science/Engineering & Technology",
  "/Science/Mathematics",
  "/Science/Physics",
  "/Shopping",
  "/Shopping/Apparel",
  "/Shopping/Auctions",
  "/Shopping/Classifieds",
  "/Shopping/Gifts & Special Event Items",
  "/Shopping/Luxury Goods",
  "/Shopping/Mass Merchants & Department Stores",
  "/Shopping/Shopping Portals & Search Engines",
  "/Shopping/Tobacco Products",
  "/Shopping/Toys",
  "/Sports",
  "/Sports/Animal Sports",
  "/Sports/Baseball",
  "/Sports/Basketball",
  "/Sports/Boxing",
  "/Sports/College Sports",
  "/Sports/Combat Sports",
  "/Sports/Cricket",
  "/Sports/Cycling",
  "/Sports/Diving & Underwater Activities",
  "/Sports/Extreme Sports",
  "/Sports/Fantasy Sports",
  "/Sports/Football",
  "/Sports/Golf",
  "/Sports/Gymnastics",
  "/Sports/Hockey",
  "/Sports/Horse Racing",
  "/Sports/Hunting & Shooting",
  "/Sports/Individual Sports",
  "/Sports/Motor Sports",
  "/Sports/Poker & Professional Gambling",
  "/Sports/Racquet Sports",
  "/Sports/Rugby",
  "/Sports/Skiing & Snowboarding",
  "/Sports/Soccer",
  "/Sports/Sporting Goods",
  "/Sports/Swimming",
  "/Sports/Team Sports",
  "/Sports/Track & Field",
  "/Sports/Volleyball",
  "/Sports/Walking & Running",
  "/Sports/Water Sports",
  "/Sports/Winter Sports",
  "/Sports/World Soccer",
  "/Sports/Wrestling",
  "/Travel",
  "/Travel/Air Travel",
  "/Travel/Bed & Breakfasts",
  "/Travel/Bus & Rail",
  "/Travel/Cruises & Charters",
  "/Travel/Hotels & Accommodations",
  "/Travel/Luggage & Travel Accessories",
  "/Travel/Tourist Destinations",
  "/Travel/Travel Agencies & Services",
  "/Health",
  "/Health/Health Conditions",
  "/Health/Medical Devices & Equipment",
  "/Health/Medical Facilities & Services",
  "/Health/Nursing",
  "/Health/Nutrition",
  "/Health/Oral & Dental Care",
  "/Health/Pharmacy",
  "/Health/Public Health",
  "/Health/Reproductive Health",
  "/Health/Substance Abuse",
  "/Health/Health Education & Medical Training"
].sort();

export default function ContentAnalyzer() {
  const [url, setUrl] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [useManualInput, setUseManualInput] = useState(false);
  const [intendedPrimary, setIntendedPrimary] = useState('');
  const [intendedSecondary, setIntendedSecondary] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showApiHelp, setShowApiHelp] = useState(false);
  const [extensionData, setExtensionData] = useState(null); // NEW: Store extension data

const fetchWithTimeout = (resource, options = {}, timeoutMs = 20000) =>
  Promise.race([
    fetch(resource, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    ),
  ]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get("source");
    const encodedData = params.get("data");
    const incomingUrl = params.get("url");
    
    if (source === 'extension' && encodedData) {
      try {
        // Decode: base64 → JSON
        const decoded = JSON.parse(decodeURIComponent(escape(atob(encodedData))));
        
        console.log('✅ Loaded extension data from URL:', {
          headings: decoded.headings?.length,
          title: decoded.title
        });
        
        setExtensionData({
          title: decoded.title || "Untitled",
          introduction: decoded.introduction || "",
          headings: decoded.headings || [],
          text: decoded.text || "",
          url: decoded.url || "",
          source: 'extension'
        });
        setUrl(decoded.url || '');
        setUseManualInput(false);
      } catch (e) {
        console.error('Failed to decode extension data:', e);
      }
    } else if (incomingUrl) {
      setUrl(incomingUrl);
      setUseManualInput(false);
    }
  }, []);

  const fetchUrlContent = async (targetUrl) => {
  const response = await fetch(`/api/extract?url=${encodeURIComponent(targetUrl)}`);

  // Always read as text first (server might return HTML/text on errors)
  const raw = await response.text();

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    // This is the exact scenario you’re hitting
    throw new Error(
      `API did not return JSON (status ${response.status}). ` +
      `Response starts with: ${raw.slice(0, 120)}`
    );
  }

  if (!response.ok) {
    throw new Error(data?.error || `Failed to fetch URL (status ${response.status})`);
  }

  // data: { title, introduction, headings[], text }
  return data;
};

// Extract first 250 words from text
const extractIntroduction = (text) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  const first250 = words.slice(0, 250).join(' ');
  return first250 + (words.length > 250 ? '...' : '');
};

// Parse content clarity explanation into structured sections
const parseContentClarityExplanation = (explanation) => {
  if (!explanation) return null;
  
  // Extract score
  const scoreMatch = explanation.match(/Score:\s*(\d+)\/100/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
  
  const parsed = {
    score,
    sections: []
  };
  
  // Split into sentences for analysis
  const sentences = explanation.split(/\.\s+/);
  
  // Try to extract title analysis (usually first)
  const titleSentences = sentences.filter(s => 
    s.includes('Title') && (s.includes('specifies') || s.includes('format') || s.includes('audience') || s.includes('scope'))
  );
  if (titleSentences.length > 0) {
    parsed.sections.push({
      type: 'title',
      label: 'Title Analysis',
      content: titleSentences.join('. ') + '.'
    });
  }
  
  // Extract headings analysis
  const headingsSentences = sentences.filter(s => 
    (s.includes('H2') || s.toLowerCase().includes('headings')) && 
    (s.includes('%') || s.includes('alignment') || s.includes('support'))
  );
  if (headingsSentences.length > 0) {
    parsed.sections.push({
      type: 'headings',
      label: 'Heading Structure',
      content: headingsSentences.join('. ') + '.'
    });
  }
  
  // Extract introduction analysis
  const introSentences = sentences.filter(s => 
    s.includes('Introduction') || s.includes('introduction')
  );
  if (introSentences.length > 0) {
    parsed.sections.push({
      type: 'introduction',
      label: 'Introduction Quality',
      content: introSentences.join('. ') + '.'
    });
  }
  
  // Extract content verification/structure
  const structureSentences = sentences.filter(s => 
    s.includes('Content verification') || 
    s.includes('topics') || 
    s.includes('hierarchy') || 
    s.includes('scope maintained') ||
    s.includes('logical')
  );
  if (structureSentences.length > 0) {
    parsed.sections.push({
      type: 'structure',
      label: 'Content Structure',
      content: structureSentences.join('. ') + '.'
    });
  }
  
  // Extract issues/weaknesses
  const issueSentences = sentences.filter(s => {
    const lower = s.toLowerCase();
    return lower.includes('lacks') || 
           lower.includes('no explicit') || 
           lower.includes('dilut') ||
           lower.includes('weak') ||
           lower.includes('missing') ||
           lower.includes('generic') ||
           (s.includes('-') && (lower.includes('pts') || lower.includes('points')));
  });
  if (issueSentences.length > 0) {
    parsed.sections.push({
      type: 'issues',
      label: 'Areas for Improvement',
      content: issueSentences.join('. ') + '.',
      isNegative: true
    });
  }
  
  // If we got very few sections, fall back to showing full text
  if (parsed.sections.length < 2) {
    return null; // Will trigger fallback display
  }
  
  return parsed;
};


  const analyzeWithGoogleNLP = async (content) => {
    // If user provided their own API key, use it directly
    if (googleApiKey && googleApiKey.trim()) {
      const response = await fetch(
        `https://language.googleapis.com/v1/documents:classifyText?key=${googleApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document: { type: 'PLAIN_TEXT', content: content.slice(0, 20000) }
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Google NLP API error');
      }

      const data = await response.json();
      
      if (!data.categories || data.categories.length === 0) {
        return {
          categories: [],
          primaryCategory: null,
          secondaryCategory: null,
          clarityGap: 0,
          alignmentStatus: 'No categories detected'
        };
      }

      const sorted = data.categories.sort((a, b) => b.confidence - a.confidence);
      const primary = sorted[0];
      const secondary = sorted[1] || null;
      const clarityGap = secondary ? (primary.confidence - secondary.confidence) : primary.confidence;

      let alignmentStatus;
      if (clarityGap >= 0.3) alignmentStatus = 'Aligned';
      else if (clarityGap >= 0.15) alignmentStatus = 'Mixed (Acceptable)';
      else alignmentStatus = 'Misaligned';

      return {
        categories: sorted,
        primaryCategory: primary,
        secondaryCategory: secondary,
        clarityGap,
        alignmentStatus
      };
    } else {
      // Use backend API (with backend's Google key)
      const response = await fetch('/api/google-nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.slice(0, 20000) })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Google NLP API error');
      }

      return await response.json();
    }
  };

  const analyzeSentimentWithGoogleNLP = async (content) => {
    // If user provided their own API key, use it directly
    if (googleApiKey && googleApiKey.trim()) {
      const response = await fetch(
        `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${googleApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document: { type: 'PLAIN_TEXT', content: content.slice(0, 20000) }
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Sentiment API error');
      }

      const data = await response.json();
      
      return {
        documentSentiment: data.documentSentiment,
        sentences: data.sentences || []
      };
    } else {
      // Use backend API (with backend's Google key)
      const response = await fetch('/api/google-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.slice(0, 20000) })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sentiment API error');
      }

      return await response.json();
    }
  };

const analyzeWithClaude = async (content, nlpResults, extraction) => {
  const title = extraction?.title || "(No title detected)";
  const introduction = extraction?.introduction || "(No introduction detected)";
  const headings = extraction?.headings || [];

  // Build sections by slicing content around heading text
  const buildSections = (headings, fullText) => {
    if (!headings.length) return [];
    const sections = [];
    for (let i = 0; i < headings.length; i++) {
      const headingText = headings[i].text;
      const nextHeadingText = headings[i + 1]?.text;
      const start = fullText.indexOf(headingText);
      const end = nextHeadingText ? fullText.indexOf(nextHeadingText) : fullText.length;
      const sectionContent = start !== -1 ? fullText.slice(start, end !== -1 ? end : fullText.length).slice(0, 1500) : "";
      sections.push({
        level: headings[i].level,
        heading: headingText,
        content: sectionContent.trim()
      });
    }
    return sections;
  };

  const sections = buildSections(headings, content);

  const sectionsText = sections.length
    ? sections.map((s, i) =>
        `Section ${i + 1} [${s.level.toUpperCase()}]: "${s.heading}"\n${s.content || "(no content extracted)"}`
      ).join("\n\n---\n\n")
    : content.slice(0, 25000);

  const categoryContext = nlpResults.primaryCategory
    ? `Detected: ${nlpResults.primaryCategory.name} (${(nlpResults.primaryCategory.confidence * 100).toFixed(1)}%)`
    : "No Google NLP category detected";

  const intentContext = intendedPrimary || intendedSecondary
    ? `\nTarget Primary: ${intendedPrimary || "(not specified)"}\nTarget Secondary: ${intendedSecondary || "(not specified)"}`
    : "";

  const prompt = `
You are an expert in content intent and AI grounding analysis.
Analyze this page section by section and provide specific, actionable editing recommendations per section.

IMPORTANT:
- Focus on clarity of intent and audience for each section
- Suggest minimal, non-destructive edits only
- Do NOT rewrite content
- Do NOT change tone or voice

PAGE OVERVIEW
URL: ${url}
Title: ${title}
Introduction: ${introduction}

Google NLP Classification:
- Primary: ${nlpResults.primaryCategory ? `${nlpResults.primaryCategory.name} (${(nlpResults.primaryCategory.confidence * 100).toFixed(1)}%)` : "None"}
- Secondary: ${nlpResults.secondaryCategory ? `${nlpResults.secondaryCategory.name} (${(nlpResults.secondaryCategory.confidence * 100).toFixed(1)}%)` : "None"}
- Clarity Gap: ${(nlpResults.clarityGap * 100).toFixed(1)}%
${intentContext}

SECTIONS TO ANALYZE:
${sectionsText}

TASKS

For each section, analyze:
1. Does the heading clearly signal the section's purpose and audience?
2. Does the content deliver on the heading's promise?
3. Are there mixed signals (wrong audience, competing topics, vague framing)?
4. What is the single most impactful edit for this section?

Also provide overall page-level analysis:
A) Current Interpretation Summary (1-2 sentences)
B) Intent Alignment: Aligned | Partially aligned | Mixed + reason
C) Top 2-4 Mixed Signals across the whole page
D) Expected Outcome if edits are applied (1-2 sentences)

GROUNDING SCORE (0-100):
Score based on:
- Title Clarity (25pts): specifies format +6, audience +6, scope +6, outcome +7
- Structural Alignment (30pts): (aligned H2s / total H2s) × 30
- Introduction Anchoring (20pts): explicit prerequisites +10, explicit audience +10
- Content Verification (15pts): title topics appear as H2s +8, scope maintained +4, logical hierarchy +3
- Audience Definition (10pts): lower bound defined +5, upper bound defined +5

In groundingExplanation: quote exact title, list 3+ H2s, show math, quote intro statements.

CategoryMatchStatus rules:
- No target provided → "No intent specified"
- Target primary matches detected → "PRIMARY MATCH"
- Target primary differs but partially supported → "WRONG PRIORITY"
- Target primary strongly conflicts → "PRIMARY MISMATCH"

Return JSON ONLY (no markdown):

{
  "categoryMatchStatus": "PRIMARY MATCH|WRONG PRIORITY|PRIMARY MISMATCH|No intent specified",
  "groundingScore": 0-100,
  "groundingExplanation": "Quote title, list 3+ H2s, show score math",
  "currentInterpretationSummary": "1-2 sentences",
  "intentAlignmentAssessment": {
    "status": "Aligned|Partially aligned|Mixed",
    "reason": "1-3 sentences"
  },
  "topMixedSignals": ["signal 1", "signal 2", "signal 3"],
  "sectionAnalysis": [
    {
      "heading": "exact heading text",
      "level": "h1|h2|h3",
      "mixedSignals": ["any mixed signals, or empty array"],
      "suggestedEdits": [
        {
          "location": "where exactly (e.g. heading text, opening sentence)",
          "change": "the minimal edit",
          "reason": "why this improves intent clarity for AI/search"
        }
      ]
    }
  ],
  "expectedOutcome": "1-2 sentences"
}

RULES:
- sectionAnalysis must include every section provided
- suggestedEdits per section: 1-3 specific edits only (skip if section is clear)
- mixedSignals: only flag real issues, leave empty array if section is clear
- Never invent sections not in the outline
`;

  // ---- API CALL ----

  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error || "Claude analysis failed");
  }

  const data = await response.json();
  const text = data.content?.find((c) => c.type === "text")?.text || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Claude response did not return valid JSON");
  return JSON.parse(jsonMatch[0]);
};
const calculateApiScores = (nlpResults, extraction) => {
  // Dimension 1 — Category Confidence (15 points)
  const confidence = nlpResults.primaryCategory?.confidence || 0;
  const confidenceScore =
    confidence >= 0.90 ? 15 :
    confidence >= 0.75 ? 11 :
    confidence >= 0.60 ? 7 : 3;

  // Dimension 2 — Clarity Gap (10 points)
  const gap = nlpResults.clarityGap || 0;
  const clarityGapScore =
    gap >= 0.40 ? 10 :
    gap >= 0.25 ? 7 :
    gap >= 0.10 ? 4 : 0;

  // Dimension 3 — Title-to-Entity Match (15 points)
  const titleText = (extraction?.title || "").toLowerCase();
  const entities = nlpResults.entities || [];
  const topEntities = entities.slice(0, 5);
  const titleMatches = topEntities.filter(e =>
    titleText.includes(e.name.toLowerCase())
  ).length;
  const titleEntityScore =
    titleMatches >= 3 ? 15 :
    titleMatches === 2 ? 13 :
    titleMatches === 1 ? 7 : 0;

  // Dimension 4 — Heading-to-Entity Match (15 points)
  const h2s = (extraction?.headings || []).filter(h => h.level === 'h2');
  const h2sWithEntity = h2s.filter(h =>
    topEntities.some(e => h.text.toLowerCase().includes(e.name.toLowerCase()))
  ).length;
  const headingEntityScore = h2s.length
    ? Math.round((h2sWithEntity / h2s.length) *
        (h2sWithEntity / h2s.length >= 0.75 ? 15 :
         h2sWithEntity / h2s.length >= 0.50 ? 10 :
         h2sWithEntity / h2s.length >= 0.25 ? 5 : 0))
    : 0;

  return {
    categoryConfidence: { score: confidenceScore, max: 15, confidence: (confidence * 100).toFixed(1) },
    clarityGap: { score: clarityGapScore, max: 10, gap: (gap * 100).toFixed(1) },
    titleEntityMatch: { score: titleEntityScore, max: 15, matches: titleMatches, topEntities: topEntities.map(e => e.name) },
    headingEntityMatch: { score: headingEntityScore, max: 15, matched: h2sWithEntity, total: h2s.length }
  };
};
  const handleAnalyze = async () => {
    
    // Validate based on mode
    if (useManualInput) {
      if (!manualContent || manualContent.trim() === '') {
        setError('Please paste your content in the text area');
        return;
      }
    } else {
      if (!url || url.trim() === '') {
        setError('Please enter a URL to analyze');
        return;
      }
    }

    setLoading(true);
    setError('');
  setResults({
    extraction,
    nlp: nlpResults,
    sentiment: sentimentResults,
    claude: claudeResults,
});

    try {
      let extraction = null;
let contentText = "";

if (useManualInput && manualContent) {
  contentText = manualContent;
  // Create extraction object for manual content
  extraction = {
    title: "Manual Content",
    introduction: extractIntroduction(manualContent),
    headings: [],
    text: manualContent
  };
} else if (extensionData) {
  // Use data from Chrome extension (already has all headings!)
  console.log('Using extension data with', extensionData.headings.length, 'headings');
  extraction = extensionData;
  // text is stripped from the URL payload to keep it short — re-fetch it
  if (!extensionData.text && extensionData.url) {
    console.log('Re-fetching full text from URL...');
    const fetched = await fetchUrlContent(extensionData.url);
    contentText = fetched.text;
  } else {
    contentText = extensionData.text;
  }
} else if (url) {
  extraction = await fetchUrlContent(url);
  contentText = extraction.text;
  // Add introduction from first 250 words if not already present
  if (!extraction.introduction && extraction.text) {
    extraction.introduction = extractIntroduction(extraction.text);
  }
} else {
  throw new Error("Please provide either a URL or paste content manually");
}

const nlpResults = await analyzeWithGoogleNLP(contentText);
const sentimentResults = await analyzeSentimentWithGoogleNLP(contentText);
const claudeResults = await analyzeWithClaude(contentText, nlpResults, extraction);

setResults({
  extraction,  // <-- new
  nlp: nlpResults,
  sentiment: sentimentResults,
  claude: claudeResults,
});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: 'linear-gradient(135deg, #eef0ff 0%, #f0e6ff 100%)' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#6c63ff' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Content LLM Analyzer</h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Analyze how search engines and LLMs categorize your content. Get actionable recommendations to improve ranking and content clarity.
          </p>
        </div>

        {/* API Keys Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <button 
            onClick={() => setShowApiHelp(!showApiHelp)}
            className="flex items-center gap-2 text-blue-800 font-medium w-full text-left"
          >
            <Info className="w-5 h-5" />
            <span>How to get API keys</span>
            <span className="ml-auto">{showApiHelp ? '−' : '+'}</span>
          </button>
          
          {showApiHelp && (
            <div className="mt-4 space-y-3 text-sm text-blue-900">
              <div>
                <strong>Google Cloud API Key (Optional):</strong>
                <ol className="list-decimal ml-5 mt-1 space-y-1">
                  <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener" className="underline">Google Cloud Console</a></li>
                  <li>Create a new project (or select existing)</li>
                  <li>Enable "Cloud Natural Language API"</li>
                  <li>Create credentials → API Key</li>
                  <li>Copy the key (starts with "AIza...")</li>
                </ol>
                <p className="mt-2 text-blue-700">Cost: ~$0.001 per analysis (5,000 free per month)</p>
                <p className="mt-1 text-blue-600 font-semibold">Or leave blank to use our backend API (no setup required)</p>
              </div>
              
              <div>
                <strong>Anthropic API Key:</strong>
                <ol className="list-decimal ml-5 mt-1 space-y-1">
                  <li>Go to <a href="https://console.anthropic.com" target="_blank" rel="noopener" className="underline">Anthropic Console</a></li>
                  <li>Sign up or log in</li>
                  <li>Go to Settings → API Keys</li>
                  <li>Create new key</li>
                  <li>Copy the key (starts with "sk-ant-...")</li>
                </ol>
                <p className="mt-2 text-blue-700">Cost: ~$0.02 per analysis</p>
              </div>
              
              <div className="bg-blue-100 p-3 rounded">
                <strong>🔒 Privacy:</strong> Your API keys are never stored. They're only used in your browser to make API calls directly to Google and Anthropic.
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          {/* Extension Data Indicator */}
          {extensionData && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>✓ Chrome Extension Data</strong> - Content extracted from rendered page 
                ({extensionData.headings.length} headings captured, including JavaScript-rendered content)
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!useManualInput}
                  onChange={() => setUseManualInput(false)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="font-medium text-gray-700">Fetch from URL</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={useManualInput}
                  onChange={() => setUseManualInput(true)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="font-medium text-gray-700">Paste Content</span>
              </label>
            </div>

            {!useManualInput ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL to Analyze *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Your Content *
                </label>
                <textarea
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="Paste your article content here..."
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Copy and paste the text content from your webpage (no HTML needed)
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intended Primary Category (Optional)
                </label>
                <select
                  value={intendedPrimary}
                  onChange={(e) => setIntendedPrimary(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="">-- Select Category --</option>
                  {GOOGLE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intended Secondary Category (Optional)
                </label>
                <select
                  value={intendedSecondary}
                  onChange={(e) => setIntendedSecondary(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="">-- Select Category --</option>
                  {GOOGLE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Cloud API Key (Optional)
                </label>
                <input
                  type="password"
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                  placeholder="AIza... (leave blank to use backend)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide your own key for full privacy, or leave blank to use our API
                </p>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: '#6c63ff', boxShadow: '0 2px 12px rgba(108,99,255,0.3)' }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Analyze Content
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1">
                  <p className="text-red-700 font-semibold mb-2">Error: {error}</p>
                  {error.includes('fetch') && !useManualInput && (
                    <div className="bg-white p-3 rounded border border-red-300 mt-2">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Quick fix:</strong> Switch to "Paste Content" mode above and manually paste your content:
                      </p>
                      <ol className="text-sm text-gray-600 list-decimal ml-4 space-y-1">
                        <li>Click the "Paste Content" radio button above</li>
                        <li>Go to your webpage and copy all the text (Ctrl+A, Ctrl+C)</li>
                        <li>Paste it in the text box that appears</li>
                        <li>Click "Analyze Content"</li>
                      </ol>
                      <button
                        onClick={() => {
                          setUseManualInput(true);
                          setError('');
                        }}
                        className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
                      >
                        Switch to Paste Content
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

{/* Results */}
{results && (
  <div className="space-y-6">

    {/* Extracted Outline */}
    {results?.extraction && (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Extracted Outline
        </h2>

        <div className="text-sm text-gray-600 mb-3 space-y-1">
          <div>
            <span className="font-semibold">Title:</span>{" "}
            {results.extraction.title || "—"}
          </div>
          <div>
            <span className="font-semibold">Introduction:</span>
            <div className="mt-2 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {results.extraction.introduction || "—"}
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50 max-h-72 overflow-auto">
          {results.extraction.headings?.length ? (
            <ul className="space-y-2">
              {results.extraction.headings.map((h, idx) => {
                const level = String(h.level || "").toLowerCase();
                const tagStyles = {
                  h1: { bg: 'rgba(108,99,255,0.1)', color: '#6c63ff' },
                  h2: { bg: 'rgba(52,211,153,0.1)', color: '#34d399' },
                  h3: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24' },
                };
                const style = tagStyles[level] || { bg: 'rgba(248,113,113,0.1)', color: '#f87171' };
                return (
                  <li key={idx} className="text-sm flex items-baseline gap-2">
                    <span className="flex-shrink-0 text-xs font-mono font-semibold text-center rounded" style={{ background: style.bg, color: style.color, width: '26px', padding: '1px 0' }}>
                      {level.toUpperCase()}
                    </span>
                    <span className={level === 'h1' ? 'text-gray-800 font-medium' : 'text-gray-600'}>{h.text}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-sm text-gray-600">
              No headings extracted.
            </div>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Extracted directly from HTML using Readability + DOM heading parsing.
        </div>
      </div>
    )}

    {/* Category Detection */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Category Detection
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Detected Primary</div>
          <div className="font-semibold">
            {results.nlp.primaryCategory?.name || "N/A"}
          </div>
          <div className="text-sm text-indigo-600">
            {results.nlp.primaryCategory
              ? `${(results.nlp.primaryCategory.confidence * 100).toFixed(1)}%`
              : ""}
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Detected Secondary</div>
          <div className="font-semibold">
            {results.nlp.secondaryCategory?.name || "None"}
          </div>
          <div className="text-sm text-purple-600">
            {results.nlp.secondaryCategory
              ? `${(results.nlp.secondaryCategory.confidence * 100).toFixed(1)}%`
              : ""}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Clarity Gap</div>
          <div className="font-semibold">
            {(results.nlp.clarityGap * 100).toFixed(1)}%
          </div>
          <div
            className={`text-sm font-medium ${
              results.nlp.alignmentStatus === "Aligned"
                ? "text-green-600"
                : results.nlp.alignmentStatus === "Mixed (Acceptable)"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {results.nlp.alignmentStatus}
          </div>
        </div>
      </div>

      {results.claude?.categoryMatchStatus && (
        <div
          className={`p-4 rounded-lg border-2 ${
            results.claude.categoryMatchStatus.includes("MATCH") &&
            !results.claude.categoryMatchStatus.includes("MISMATCH")
              ? "bg-green-50 border-green-300"
              : results.claude.categoryMatchStatus.includes("WRONG PRIORITY")
              ? "bg-yellow-50 border-yellow-300"
              : results.claude.categoryMatchStatus.includes("MISMATCH")
              ? "bg-red-50 border-red-300"
              : "bg-gray-50 border-gray-300"
          }`}
        >
          <div className="font-semibold text-gray-800 mb-1">
            Category Match Status
          </div>
          <div className="text-sm">
            {results.claude.categoryMatchStatus}
          </div>
        </div>
      )}
    </div>

    {/* Sentiment Analysis */}
    {results?.sentiment && (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Content Sentiment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Overall Sentiment</div>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                results.sentiment.documentSentiment.score >= 0.25 ? 'bg-green-500' :
                results.sentiment.documentSentiment.score <= -0.25 ? 'bg-red-500' :
                'bg-gray-400'
              }`}></div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {results.sentiment.documentSentiment.score >= 0.25 ? 'Positive' :
                   results.sentiment.documentSentiment.score <= -0.25 ? 'Negative' :
                   'Neutral'}
                </div>
                <div className="text-sm text-gray-600">
                  Score: <span className="font-semibold">{results.sentiment.documentSentiment.score.toFixed(2)}</span>
                  <span className="text-xs ml-1">(Range: -1.0 to 1.0)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Emotional Intensity</div>
            <div className="text-2xl font-bold text-gray-800">
              {results.sentiment.documentSentiment.magnitude.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {results.sentiment.documentSentiment.magnitude < 1 ? 'Very Low' :
               results.sentiment.documentSentiment.magnitude < 3 ? 'Low' :
               results.sentiment.documentSentiment.magnitude < 5 ? 'Moderate' :
               results.sentiment.documentSentiment.magnitude < 8 ? 'High' : 'Very High'}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
          <strong className="text-gray-800">What this means:</strong>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li><strong>Score:</strong> Ranges from -1.0 (very negative) to 1.0 (very positive). Neutral content scores near 0.0</li>
            <li><strong>Magnitude:</strong> Measures how much emotional content exists (0+ scale). Higher values indicate stronger emotional language</li>
            <li>Neutral, factual content (like documentation) typically has low magnitude (0-2)</li>
            <li>Opinionated content (like reviews or testimonials) has high magnitude (3+)</li>
          </ul>
        </div>
      </div>
    )}

    {/* Scoring Rubric */}
{results?.claude && results?.apiScores && (() => {
  const api = results.apiScores;
  const dim = results.claude.dimensionScores;
  const totalScore =
    (api.categoryConfidence.score || 0) +
    (api.clarityGap.score || 0) +
    (api.titleEntityMatch.score || 0) +
    (api.headingEntityMatch.score || 0) +
    (dim?.introAudienceSignal?.score || 0) +
    (dim?.scopeConsistency?.score || 0) +
    (dim?.contentDelivery?.totalScore || 0);

  const dimensions = [
    {
      label: "Category Confidence",
      source: "NLP API",
      score: api.categoryConfidence.score,
      max: 15,
      detail: `Primary category confidence: ${api.categoryConfidence.confidence}%`,
      isApi: true
    },
    {
      label: "Clarity Gap",
      source: "NLP API",
      score: api.clarityGap.score,
      max: 10,
      detail: `Gap between primary and secondary: ${api.clarityGap.gap}%`,
      isApi: true
    },
    {
      label: "Title-to-Entity Match",
      source: "NLP API",
      score: api.titleEntityMatch.score,
      max: 15,
      detail: `${api.titleEntityMatch.matches} of top 5 entities appear in title: ${api.titleEntityMatch.topEntities.join(", ")}`,
      isApi: true
    },
    {
      label: "Heading-to-Entity Match",
      source: "NLP API",
      score: api.headingEntityMatch.score,
      max: 15,
      detail: `${api.headingEntityMatch.matched} of ${api.headingEntityMatch.total} H2s contain a salient entity`,
      isApi: true
    },
    {
      label: "Intro Audience Signal",
      source: "Claude",
      score: dim?.introAudienceSignal?.score || 0,
      max: 10,
      detail: dim?.introAudienceSignal?.evidence || dim?.introAudienceSignal?.reason || "—",
      isApi: false
    },
    {
      label: "Scope Consistency",
      source: "Claude",
      score: dim?.scopeConsistency?.score || 0,
      max: 10,
      detail: dim?.scopeConsistency?.reason || "—",
      isApi: false
    },
    {
      label: "Content Delivery & Claim Grounding",
      source: "Claude",
      score: dim?.contentDelivery?.totalScore || 0,
      max: 25,
      detail: dim?.contentDelivery?.reason || "—",
      isApi: false,
      breakdown: dim?.contentDelivery ? [
        { label: "Section delivery", score: dim.contentDelivery.sectionDeliveryScore, max: 10 },
        { label: "Claim support", score: dim.contentDelivery.claimSupportScore, max: 10 },
        { label: "Ungrounded language", score: dim.contentDelivery.ungroundedLanguageScore, max: 5 }
      ] : null
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Content Clarity Score</h2>
      <p className="text-sm text-gray-500 mb-4">65 of 100 points are grounded in NLP API data</p>

      {/* Total */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700">Total Score</span>
        <span className="text-3xl font-bold" style={{ color: '#6c63ff' }}>{totalScore}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className={`h-3 rounded-full ${totalScore >= 75 ? 'bg-green-500' : totalScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${totalScore}%` }}
        />
      </div>

      {/* Dimension breakdown */}
      <div className="space-y-3">
        {dimensions.map((d, idx) => (
          <div key={idx} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${d.isApi ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {d.source}
                </span>
                <span className="font-medium text-gray-800 text-sm">{d.label}</span>
              </div>
              <span className="font-bold text-gray-800">{d.score}/{d.max}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
              <div
                className={`h-1.5 rounded-full ${d.score / d.max >= 0.75 ? 'bg-green-500' : d.score / d.max >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${(d.score / d.max) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">{d.detail}</p>
            {d.breakdown && (
              <div className="mt-2 space-y-1 pl-2 border-l-2 border-gray-200">
                {d.breakdown.map((b, i) => (
                  <div key={i} className="flex justify-between text-xs text-gray-500">
                    <span>{b.label}</span>
                    <span className="font-semibold">{b.score}/{b.max}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ungrounded claims */}
      {dim?.contentDelivery?.ungroundedClaims?.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="font-semibold text-red-800 mb-2 text-sm">Ungrounded Claims Found</div>
          <div className="space-y-2">
            {dim.contentDelivery.ungroundedClaims.map((c, i) => (
              <div key={i} className="bg-white border border-red-200 rounded p-3 text-sm">
                <div className="text-gray-500 text-xs mb-1">{c.section}</div>
                <div className="italic text-gray-700 mb-1">"{c.quote}"</div>
                <div className="text-red-700">{c.issue}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
})()}
                
                {/* Structured Sections */}
                <div className="grid gap-3">
                  {parsed.sections.map((section, idx) => (
                    <div key={idx} className={`p-3 rounded border ${
                      section.isNegative 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-start gap-2">
                        <div className={`flex-shrink-0 w-2 h-2 mt-1.5 rounded-full ${
                          section.type === 'title' ? 'bg-blue-500' :
                          section.type === 'headings' ? 'bg-green-500' :
                          section.type === 'introduction' ? 'bg-purple-500' :
                          section.type === 'issues' ? 'bg-red-500' :
                          'bg-orange-500'
                        }`} />
                        <div className="flex-1">
                          <div className={`font-semibold text-xs uppercase tracking-wide mb-1 ${
                            section.isNegative ? 'text-red-900' : 'text-gray-900'
                          }`}>
                            {section.label}
                          </div>
                          <div className={`text-sm leading-relaxed ${
                            section.isNegative ? 'text-red-800' : 'text-gray-700'
                          }`}>
                            {section.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Full explanation as expandable */}
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                    View full analysis
                  </summary>
                  <div className="mt-2 text-xs text-gray-600 leading-relaxed">
                    {results.claude.groundingExplanation}
                  </div>
                </details>
              </div>
            );
          }
          
          // Fallback: show original if parsing fails
          return results.claude.groundingExplanation;
        })()}
      </div>

      {results.claude.alignmentExplanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="font-semibold text-gray-800 mb-2">
            Alignment Details
          </div>
          <p className="text-sm text-gray-700">
            {results.claude.alignmentExplanation}
          </p>
        </div>
      )}
    </div>
{/* Section-by-Section Analysis */}
{results?.claude?.sectionAnalysis?.length > 0 && (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-2">Section-by-Section Analysis</h2>
    <p className="text-sm text-gray-600 mb-4">
      Expand each section to see specific editing recommendations
    </p>
    <div className="space-y-2">
      {results.claude.sectionAnalysis.map((section, idx) => {
        const hasIssues = section.mixedSignals?.length > 0 || section.suggestedEdits?.length > 0;
        return (
          <details key={idx} className="border rounded-lg overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 list-none">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded" style={{
                  background: section.level === 'h1' ? 'rgba(108,99,255,0.1)' : section.level === 'h2' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
                  color: section.level === 'h1' ? '#6c63ff' : section.level === 'h2' ? '#059669' : '#d97706'
                }}>
                  {section.level?.toUpperCase()}
                </span>
                <span className="font-medium text-gray-800 text-sm">{section.heading}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                {hasIssues
                  ? <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{section.suggestedEdits?.length || 0} edit{section.suggestedEdits?.length !== 1 ? 's' : ''}</span>
                  : <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">✓ Clear</span>
                }
                <span className="text-gray-400 text-sm">▼</span>
              </div>
            </summary>

            <div className="px-4 pb-4 border-t bg-gray-50">
              {section.mixedSignals?.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-semibold text-yellow-800 uppercase tracking-wide mb-2">Mixed Signals</div>
                  <ul className="space-y-1">
                    {section.mixedSignals.map((signal, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-yellow-500 flex-shrink-0">⚠</span>
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {section.suggestedEdits?.length > 0 ? (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-2">Suggested Edits</div>
                  {section.suggestedEdits.map((edit, i) => (
                    <div key={i} className="bg-white border border-green-200 rounded-lg p-3 text-sm">
                      <div><span className="font-semibold text-gray-700">Location:</span> {edit.location}</div>
                      <div className="mt-1"><span className="font-semibold text-gray-700">Change:</span> {edit.change}</div>
                      <div className="mt-1"><span className="font-semibold text-gray-700">Reason:</span> {edit.reason}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-sm text-green-700">
                  ✓ This section has clear intent and no suggested edits.
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  </div>
)}
    {/* Intent & Clarity Recommendations (A–E) */}
    {results?.claude && (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">
      Intent & Clarity Recommendations
    </h2>

    {/* A */}
    {results.claude.currentInterpretationSummary && (
      <div className="p-4 bg-gray-50 rounded-lg mb-3">
        <div className="font-semibold text-gray-800 mb-1">
          A. Current Interpretation Summary
        </div>
        <div className="text-sm text-gray-700">
          {results.claude.currentInterpretationSummary}
        </div>
      </div>
    )}

    {/* B */}
    {results.claude.intentAlignmentAssessment && (
      <div className="p-4 bg-blue-50 rounded-lg mb-3">
        <div className="font-semibold text-gray-800 mb-1">
          B. Intent Alignment Assessment
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-semibold">
            {results.claude.intentAlignmentAssessment.status || "—"}
          </span>
          {results.claude.intentAlignmentAssessment.reason
            ? ` — ${results.claude.intentAlignmentAssessment.reason}`
            : ""}
        </div>
      </div>
    )}

    {/* C */}
    {Array.isArray(results.claude.topMixedSignals) && results.claude.topMixedSignals.length > 0 && (
      <div className="p-4 bg-yellow-50 rounded-lg mb-3">
        <div className="font-semibold text-gray-800 mb-2">
          C. Top Mixed Signals
        </div>
        <ul className="space-y-2">
          {results.claude.topMixedSignals.map((s, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex gap-2">
              <span className="text-gray-500">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* D */}
    {Array.isArray(results.claude.suggestedEdits) && results.claude.suggestedEdits.length > 0 && (
      <div className="p-4 bg-green-50 rounded-lg mb-3">
        <div className="font-semibold text-gray-800 mb-2">
          D. Suggested Non-Destructive Edits
        </div>
{results?.claude?.highestImpactEdit && (
  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-4">
    <div className="font-semibold text-gray-800 mb-2">Highest-Impact Edit</div>

    <div className="text-sm text-gray-700">
      <div className="mb-1">
        <span className="font-semibold">Location:</span>{" "}
        {results.claude.highestImpactEdit.location}
      </div>
      <div className="mb-1">
        <span className="font-semibold">Change:</span>{" "}
        {results.claude.highestImpactEdit.change}
      </div>
      <div>
        <span className="font-semibold">Reason:</span>{" "}
        {results.claude.highestImpactEdit.reason || "—"}
      </div>
    </div>
  </div>
)}
        <div className="space-y-3">
          {results.claude.suggestedEdits.map((e, idx) => (
            <div key={idx} className="bg-white border border-green-200 rounded-lg p-3">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Location:</span>{" "}
                {e.location || "—"}
              </div>
              <div className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Change:</span>{" "}
                {e.change || "—"}
              </div>
              <div className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Reason:</span>{" "}
                {e.reason || "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* E */}
    {results.claude.expectedOutcome && (
      <div className="p-4 bg-purple-50 rounded-lg">
        <div className="font-semibold text-gray-800 mb-1">
          E. Expected Outcome
        </div>
        <div className="text-sm text-gray-700">
          {results.claude.expectedOutcome}
        </div>
      </div>
    )}
  </div>
)}
  </div>
)}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Built with Google Cloud Natural Language API & Anthropic Claude</p>
        </div>
      </div>
    </div>
  );
}