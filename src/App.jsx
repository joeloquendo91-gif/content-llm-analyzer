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
  const [useManualInput, setUseManualInput] = useState(false);
  const [intendedPrimary, setIntendedPrimary] = useState('');
  const [intendedSecondary, setIntendedSecondary] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [anthropicApiKey, setAnthropicApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showApiHelp, setShowApiHelp] = useState(false);

  const fetchUrlContent = async (targetUrl) => {
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
    ];

    let lastError = '';
    
    for (let i = 0; i < proxies.length; i++) {
      try {
        const response = await fetch(proxies[i], {
          signal: AbortSignal.timeout(15000) // 15 second timeout
        });
        
        if (!response.ok) {
          lastError = `Proxy ${i + 1}: HTTP ${response.status}`;
          continue;
        }
        
        const html = await response.text();
        
        if (!html || html.length < 100) {
          lastError = `Proxy ${i + 1}: Content too short`;
          continue;
        }
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Remove junk
        const junk = doc.querySelectorAll('script, style, nav, header, footer, aside, iframe, form');
        junk.forEach(el => el.remove());
        
        const text = doc.body.textContent || '';
        const cleaned = text.replace(/\s+/g, ' ').trim();
        
        if (cleaned.length < 100) {
          lastError = `Proxy ${i + 1}: Insufficient content`;
          continue;
        }
        
        return cleaned.slice(0, 50000);
      } catch (err) {
        lastError = `Proxy ${i + 1}: ${err.message}`;
        continue;
      }
    }
    
    throw new Error(`All proxies failed. Last error: ${lastError}. Try pasting content manually or use a different URL.`);
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

  const analyzeWithClaude = async (content, nlpResults) => {
    const categoryContext = nlpResults.primaryCategory 
      ? `Detected: ${nlpResults.primaryCategory.name} (${(nlpResults.primaryCategory.confidence * 100).toFixed(1)}%)`
      : 'No categories detected';
    
    const intentContext = intendedPrimary 
      ? `\nIntended Primary: ${intendedPrimary}${intendedSecondary ? `, Secondary: ${intendedSecondary}` : ''}`
      : '';

    const prompt = `${categoryContext}${intentContext}

Content: ${content.slice(0, 30000)}

Analyze this content for LLM grounding. Provide JSON (no markdown):
{
  "alignmentExplanation": "Does detected match intended? Why/why not?",
  "groundingScore": 0-100,
  "groundingExplanation": "What makes this grounded for PRIMARY category",
  "categoryMatchStatus": "PRIMARY MATCH|WRONG PRIORITY|PRIMARY MISMATCH|No intent specified",
  "keyImprovements": {
    "h1": "Current H1 and recommendation",
    "structure": "H2 ordering issues and fixes",
    "intro": "Intro analysis and changes needed",
    "topRecommendations": ["Top 3-5 actionable changes"]
  }
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Claude API error');
    }

    const data = await response.json();
    const text = data.content.find(c => c.type === 'text')?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error('Could not parse analysis');
    return JSON.parse(jsonMatch[0]);
  };

  const handleAnalyze = async () => {
    if ((!url && !manualContent) || !googleApiKey || !anthropicApiKey) {
      setError('Please fill in content (URL or manual), and both API keys');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      let content;
      
      if (useManualInput && manualContent) {
        content = manualContent;
      } else if (url) {
        content = await fetchUrlContent(url);
      } else {
        throw new Error('Please provide either a URL or paste content manually');
      }
      
      const nlpResults = await analyzeWithGoogleNLP(content);
      const claudeResults = await analyzeWithClaude(content, nlpResults);

      setResults({
        nlp: nlpResults,
        claude: claudeResults
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anthropic API Key *
                </label>
                <input
                  type="password"
                  value={anthropicApiKey}
                  onChange={(e) => setAnthropicApiKey(e.target.value)}
                  placeholder="sk-ant-..."
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
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Category Detection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Category Detection</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Detected Primary</div>
                  <div className="font-semibold">{results.nlp.primaryCategory?.name || 'N/A'}</div>
                  <div className="text-sm text-indigo-600">
                    {results.nlp.primaryCategory ? `${(results.nlp.primaryCategory.confidence * 100).toFixed(1)}%` : ''}
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Detected Secondary</div>
                  <div className="font-semibold">{results.nlp.secondaryCategory?.name || 'None'}</div>
                  <div className="text-sm text-purple-600">
                    {results.nlp.secondaryCategory ? `${(results.nlp.secondaryCategory.confidence * 100).toFixed(1)}%` : ''}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Clarity Gap</div>
                  <div className="font-semibold">{(results.nlp.clarityGap * 100).toFixed(1)}%</div>
                  <div className={`text-sm font-medium ${
                    results.nlp.alignmentStatus === 'Aligned' ? 'text-green-600' :
                    results.nlp.alignmentStatus === 'Mixed (Acceptable)' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {results.nlp.alignmentStatus}
                  </div>
                </div>
              </div>

              {results.claude.categoryMatchStatus && (
                <div className={`p-4 rounded-lg border-2 ${
                  results.claude.categoryMatchStatus.includes('MATCH') && !results.claude.categoryMatchStatus.includes('MISMATCH')
                    ? 'bg-green-50 border-green-300' :
                  results.claude.categoryMatchStatus.includes('WRONG PRIORITY')
                    ? 'bg-yellow-50 border-yellow-300' :
                  results.claude.categoryMatchStatus.includes('MISMATCH')
                    ? 'bg-red-50 border-red-300' :
                  'bg-gray-50 border-gray-300'
                }`}>
                  <div className="font-semibold text-gray-800 mb-1">Category Match Status</div>
                  <div className="text-sm">{results.claude.categoryMatchStatus}</div>
                </div>
              )}
            </div>

            {/* Grounding Score */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Grounding Analysis</h2>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Grounding Score</span>
                  <span className="text-2xl font-bold text-indigo-600">{results.claude.groundingScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      results.claude.groundingScore >= 75 ? 'bg-green-500' :
                      results.claude.groundingScore >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${results.claude.groundingScore}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{results.claude.groundingExplanation}</p>
              </div>

              {results.claude.alignmentExplanation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-2">Alignment Details</div>
                  <p className="text-sm text-gray-700">{results.claude.alignmentExplanation}</p>
                </div>
              )}
            </div>

            {/* Key Improvements */}
            {results.claude.keyImprovements && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Key Improvements</h2>
                
                <div className="space-y-4">
                  {results.claude.keyImprovements.h1 && (
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-2">H1 Analysis</div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{results.claude.keyImprovements.h1}</p>
                    </div>
                  )}

                  {results.claude.keyImprovements.structure && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-2">Heading Structure</div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{results.claude.keyImprovements.structure}</p>
                    </div>
                  )}

                  {results.claude.keyImprovements.intro && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-2">Introduction</div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{results.claude.keyImprovements.intro}</p>
                    </div>
                  )}

                  {results.claude.keyImprovements.topRecommendations && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-3">Top Recommendations</div>
                      <ul className="space-y-2">
                        {results.claude.keyImprovements.topRecommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Built with Google Cloud Natural Language API & Anthropic Claude</p>
          <p className="mt-2">Your API keys are never stored or sent to our servers</p>
        </div>
      </div>
    </div>
  );
}