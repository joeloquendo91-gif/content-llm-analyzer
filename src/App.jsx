import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, TrendingUp, Info, X } from 'lucide-react';

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
  const [useManualInput, setUseManualInput] = useState(true); // Changed to true - paste mode is default
  const [intendedPrimary, setIntendedPrimary] = useState('');
  const [intendedSecondary, setIntendedSecondary] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showApiHelp, setShowApiHelp] = useState(false);

const fetchWithTimeout = (resource, options = {}, timeoutMs = 20000) =>
  Promise.race([
    fetch(resource, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    ),
  ]);

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

  // data: { title, excerpt, headings[], text }
  return data;
};


  const analyzeWithGoogleNLP = async (content) => {
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
  };

  const analyzeWithClaude = async (content, nlpResults, extraction) => {
  // ---- STRUCTURE FROM EXTRACTION (SOURCE OF TRUTH) ----

  const title = extraction?.title || "(No title detected)";
  const excerpt = extraction?.excerpt || "(No excerpt detected)";
  const headings = extraction?.headings || [];

  const outline = headings.length
    ? headings
        .slice(0, 40) // safety cap
        .map(
          (h, i) => `${i + 1}. ${h.level.toUpperCase()}: ${h.text}`
        )
        .join("\n")
    : "No headings extracted.";

  // ---- CATEGORY CONTEXT ----

  const categoryContext = nlpResults.primaryCategory
    ? `Detected Category: ${nlpResults.primaryCategory.name} (${(
        nlpResults.primaryCategory.confidence * 100
      ).toFixed(1)}%)`
    : "No Google NLP category detected";

  const intentContext =
  intendedPrimary || intendedSecondary
    ? `\nTarget Primary Category: ${intendedPrimary || "(not specified)"}\nTarget Secondary Category: ${intendedSecondary || "(not specified)"}`
    : "";

  // ---- PROMPT ----

  const prompt = `
You are an expert in content intent interpretation and grounding for AI and search systems.
Evaluate how the page is currently understood, identify mixed or competing signals, and recommend light, non-destructive edits.

INPUTS
URL: ${url}
Google NLP:
- Primary: ${nlpResults.primaryCategory ? `${nlpResults.primaryCategory.name} (${(nlpResults.primaryCategory.confidence * 100).toFixed(1)}%)` : "None"}
- Secondary: ${nlpResults.secondaryCategory ? `${nlpResults.secondaryCategory.name} (${(nlpResults.secondaryCategory.confidence * 100).toFixed(1)}%)` : "None"}
- Clarity gap: ${(nlpResults.clarityGap * 100).toFixed(1)}%
${intentContext}

EXTRACTED STRUCTURE (do not guess headings)
Title: ${extraction?.title || ""}
Excerpt: ${extraction?.excerpt || ""}
Outline:
${(extraction?.headings || []).slice(0, 30).map(h => `${h.level.toUpperCase()}: ${h.text}`).join("\n") || "(none)"}

CONTENT (truncated):
${content.slice(0, 25000)}

TASKS
1) Interpret Current Intent
2) Assess Intent Alignment (use targets if provided; otherwise infer intended audience/purpose)
3) Identify Key Mixed Signals (top 2–4)
4) Recommend Non-Destructive Edits (NO rewrites, NO tone change, NO big section adds/removals)
5) Explain the Why (why each edit improves interpretability for AI/search)

Return JSON ONLY (no markdown). Use exactly this schema:

{
  "categoryMatchStatus": "PRIMARY MATCH|WRONG PRIORITY|PRIMARY MISMATCH|No intent specified",
  "groundingScore": 0-100,
  "groundingExplanation": "1–4 sentences. Why this score. Must reference Title + at least 2 headings from the extracted outline.",
  "currentInterpretationSummary": "A. 1–2 sentences",
  "intentAlignmentAssessment": {
    "status": "Aligned|Partially aligned|Mixed",
    "reason": "B. 1–3 sentences"
  },
  "topMixedSignals": ["C. Signal 1", "C. Signal 2", "C. Signal 3 (optional)", "C. Signal 4 (optional)"],
  "suggestedEdits": [
    {
      "location": "D. Where on page (e.g., H1, Intro paragraph, H2: '...', section order)",
      "change": "D. The minimal edit (rename/reorder/bridge sentence tweak)",
      "reason": "D. Why this improves interpretability for AI/search"
    }
  ],
  "expectedOutcome": "E. 1–2 sentences"
}


CategoryMatchStatus rules:
- If no target primary/secondary provided: "No intent specified"
- If target primary matches detected primary: "PRIMARY MATCH"
- If target primary differs but page still supports it partially: "WRONG PRIORITY"
- If target primary strongly conflicts with detected primary: "PRIMARY MISMATCH"
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

  // ---- PARSE JSON SAFELY ----

  const text = data.content?.find((c) => c.type === "text")?.text || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Claude response did not return valid JSON");
  }

  return JSON.parse(jsonMatch[0]);
};

  const handleAnalyze = async () => {
    if ((!url && !manualContent) || !googleApiKey) {
      setError('Please fill in content (URL or manual)');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      let extraction = null;
let contentText = "";

if (useManualInput && manualContent) {
  contentText = manualContent;
} else if (url) {
  extraction = await fetchUrlContent(url);
  contentText = extraction.text;
} else {
  throw new Error("Please provide either a URL or paste content manually");
}

const nlpResults = await analyzeWithGoogleNLP(contentText);
const claudeResults = await analyzeWithClaude(contentText, nlpResults, extraction);

setResults({
  extraction,  // <-- new
  nlp: nlpResults,
  claude: claudeResults,
});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Content LLM Analyzer</h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Analyze how search engines and LLMs categorize your content. Get actionable recommendations to improve ranking and grounding.
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
                <strong>Google Cloud API Key:</strong>
                <ol className="list-decimal ml-5 mt-1 space-y-1">
                  <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener" className="underline">Google Cloud Console</a></li>
                  <li>Create a new project (or select existing)</li>
                  <li>Enable "Cloud Natural Language API"</li>
                  <li>Create credentials → API Key</li>
                  <li>Copy the key (starts with "AIza...")</li>
                </ol>
                <p className="mt-2 text-blue-700">Cost: ~$0.001 per analysis (5,000 free per month)</p>
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
                  Google Cloud API Key *
                </label>
                <input
                  type="password"
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <span className="font-semibold">Excerpt:</span>{" "}
            {results.extraction.excerpt || "—"}
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50 max-h-72 overflow-auto">
          {results.extraction.headings?.length ? (
            <ul className="space-y-2">
              {results.extraction.headings.map((h, idx) => (
                <li key={idx} className="text-sm flex gap-2">
                  <span className="w-10 font-mono text-gray-500">
                    {String(h.level || "").toUpperCase()}
                  </span>
                  <span className="text-gray-800">{h.text}</span>
                </li>
              ))}
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

    {/* Grounding Analysis */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Grounding Analysis
      </h2>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Grounding Score</span>
          <span className="text-2xl font-bold text-indigo-600">
            {results.claude.groundingScore}/100
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${
              results.claude.groundingScore >= 75
                ? "bg-green-500"
                : results.claude.groundingScore >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${results.claude.groundingScore}%` }}
          />
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
        {results.claude.groundingExplanation}
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