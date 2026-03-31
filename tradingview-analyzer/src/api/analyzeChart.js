const BASE_URL = 'https://integrate.api.nvidia.com/v1';
const MODEL = 'qwen/qwen2.5-vl-72b-instruct';

const ANALYSIS_PROMPT = `You are an expert technical analyst specializing in financial chart analysis. Analyze this trading chart screenshot and provide a comprehensive technical analysis report.

Return your response as a valid JSON object (no markdown, no code blocks, just raw JSON) with exactly this structure:

{
  "symbol": "detected symbol or 'Unknown'",
  "timeframe": "detected timeframe or 'Unknown'",
  "currentPrice": "current price if visible or null",
  "trend": {
    "direction": "UPTREND | DOWNTREND | SIDEWAYS",
    "strength": "STRONG | MODERATE | WEAK",
    "description": "brief description of the trend"
  },
  "supportLevels": [
    { "price": "price level", "strength": "STRONG | MODERATE | WEAK", "description": "why this is support" }
  ],
  "resistanceLevels": [
    { "price": "price level", "strength": "STRONG | MODERATE | WEAK", "description": "why this is resistance" }
  ],
  "patterns": [
    { "name": "pattern name", "type": "BULLISH | BEARISH | NEUTRAL", "description": "description and implications" }
  ],
  "indicators": [
    { "name": "indicator name", "value": "current value if visible", "signal": "BULLISH | BEARISH | NEUTRAL", "description": "analysis of the indicator" }
  ],
  "stopLoss": {
    "price": "recommended SL price",
    "percentage": "% from entry",
    "rationale": "explanation of why this level"
  },
  "takeProfit": {
    "price": "recommended TP price",
    "percentage": "% from entry",
    "rrRatio": "Risk:Reward ratio e.g. 1:2.5",
    "rationale": "explanation of why this level"
  },
  "recommendation": {
    "action": "BUY | SELL | NEUTRAL",
    "confidence": 0-100,
    "confidenceLabel": "HIGH | MEDIUM | LOW",
    "summary": "2-3 sentence trading setup summary",
    "keyFactors": ["factor 1", "factor 2", "factor 3"]
  },
  "risks": ["risk 1", "risk 2"],
  "warnings": []
}

Be precise with price levels. If an indicator is not visible, omit it from the indicators array. Provide realistic, professional-grade analysis.`;

export async function analyzeChart(imageBase64, mimeType, apiKey) {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
              },
            },
            {
              type: 'text',
              text: ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.detail || err?.message || `API error ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty response from model');
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');
  return JSON.parse(jsonMatch[0]);
}
