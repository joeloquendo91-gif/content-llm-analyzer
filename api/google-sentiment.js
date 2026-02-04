// api/google-sentiment.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Google Cloud API key not configured' });
    }

    const response = await fetch(
      `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document: { type: 'PLAIN_TEXT', content: content.slice(0, 20000) }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Google NLP error:', data);
      return res.status(response.status).json({ 
        error: data.error?.message || 'Google NLP API error',
        details: data
      });
    }

    res.status(200).json({
      documentSentiment: data.documentSentiment,
      sentences: data.sentences || []
    });
  } catch (error) {
    console.error('Sentiment API error:', error);
    res.status(500).json({ error: error.message });
  }
}