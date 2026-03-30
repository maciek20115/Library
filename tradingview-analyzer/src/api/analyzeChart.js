import Anthropic from '@anthropic-ai/sdk';

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
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: ANALYSIS_PROMPT,
          },
        ],
      },
    ],
  });

  const text = response.content[0].text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');
  return JSON.parse(jsonMatch[0]);
}
