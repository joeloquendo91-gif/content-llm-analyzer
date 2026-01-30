// api/google-nlp.js
// Google NLP endpoint with backend API key fallback

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Get your Google API key from environment variable
    const googleApiKey = process.env.GOOGLE_CLOUD_API_KEY;
    
    if (!googleApiKey) {
      return res.status(500).json({ 
        error: 'Backend Google API key not configured. Please use your own API key.' 
      });
    }
    
    // Call Google NLP API
    const response = await fetch(
      `https://language.googleapis.com/v1/documents:classifyText?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document: { 
            type: 'PLAIN_TEXT', 
            content: content.slice(0, 20000) 
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ 
        error: error.error?.message || 'Google NLP API error' 
      });
    }

    const data = await response.json();
    
    // Handle no categories
    if (!data.categories || data.categories.length === 0) {
      return res.json({
        categories: [],
        primaryCategory: null,
        secondaryCategory: null,
        clarityGap: 0,
        alignmentStatus: 'No categories detected'
      });
    }

    // Process and return results
    const sorted = data.categories.sort((a, b) => b.confidence - a.confidence);
    const primary = sorted[0];
    const secondary = sorted[1] || null;
    const clarityGap = secondary 
      ? (primary.confidence - secondary.confidence) 
      : primary.confidence;

    let alignmentStatus;
    if (clarityGap >= 0.3) alignmentStatus = 'Aligned';
    else if (clarityGap >= 0.15) alignmentStatus = 'Mixed (Acceptable)';
    else alignmentStatus = 'Misaligned';

    res.json({
      categories: sorted,
      primaryCategory: primary,
      secondaryCategory: secondary,
      clarityGap,
      alignmentStatus
    });

  } catch (error) {
    console.error('Google NLP error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze content. Please try again.' 
    });
  }
}