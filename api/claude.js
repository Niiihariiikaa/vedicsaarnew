export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { birthDetails, question, isInitial } = req.body;

  if (!birthDetails) {
    return res.status(400).json({ error: 'Missing birthDetails' });
  }

  const userContent = isInitial
    ? `I want my Vedic Janma Kundli reading.

My birth details:
${birthDetails}

Please give me:
- My Ascendant (Lagna), Sun sign, Moon sign and their key qualities
- My current Mahadasha and what it means for my life right now
- Key life themes — career potential, relationship nature, strengths and challenges
- One practical Vedic remedy or suggestion

Write in a warm, conversational style — 3 to 4 paragraphs. Be specific to my chart.`
    : `My birth details:
${birthDetails}

Question: ${question}

Answer in 2–3 focused, conversational paragraphs. Be specific to my chart.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system: `You are a warm, knowledgeable Vedic astrologer trained in Jyotish Shastra. You use the sidereal zodiac with Lahiri ayanamsha. When given birth details, calculate the approximate planetary positions and give a genuine Vedic reading. Mention actual planet signs, houses, and nakshatras where relevant. Be specific to the person's chart — never give vague, generic horoscope language or say things like "the stars say" or "the universe wants". Sound like a wise, caring counsellor who truly knows Vedic astrology.`,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || `Claude API ${response.status}`);
    return res.status(200).json({ text: data.content[0].text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
