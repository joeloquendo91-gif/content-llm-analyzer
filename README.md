# Content LLM Analyzer

Analyze how search engines and LLMs (ChatGPT, Claude, Perplexity) categorize your content. Get actionable, evidence-based recommendations to improve category alignment and grounding.

## Features

- 🔍 **Category Detection**: See what Google thinks your content is about
- 📊 **Grounding Analysis**: Measure how well LLMs can cite your content
- 🎯 **Intent Matching**: Compare detected vs intended categories
- 💡 **Actionable Recommendations**: Specific H1, H2, and intro improvements

## How It Works

1. Enter your content URL
2. Optionally specify your intended categories
3. Add your API keys (Google Cloud & Anthropic)
4. Get detailed analysis and recommendations

## Setup

### Prerequisites

- Node.js 16+ installed
- Google Cloud API key ([Get one here](https://console.cloud.google.com/apis/credentials))
- Anthropic API key ([Get one here](https://console.anthropic.com))

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/content-analyzer.git

# Navigate to project
cd content-analyzer

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Visit `http://localhost:5173` to see the app.

### Build for Production

\`\`\`bash
npm run build
\`\`\`

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/content-analyzer)

Or manually:

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## API Costs

- Google NLP: ~$0.001 per analysis (5,000 free/month)
- Anthropic Claude: ~$0.02 per analysis
- **Total: ~$0.021 per URL**

## Privacy

Your API keys are never stored or sent to any server. All API calls are made directly from your browser to Google and Anthropic.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Google Cloud Natural Language API
- Anthropic Claude API

## License

MIT

## Contributing

Beta feedback welcome! Open an issue or submit a PR.