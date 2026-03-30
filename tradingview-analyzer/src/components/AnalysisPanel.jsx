import React from 'react';
import {
  TrendingUp, TrendingDown, Minus, ArrowUpCircle, ArrowDownCircle,
  Shield, Target, AlertTriangle, BarChart2, Activity, ChevronRight
} from 'lucide-react';

const SIGNAL_COLORS = {
  BULLISH: 'text-[#00c853]',
  BEARISH: 'text-[#ff1744]',
  NEUTRAL: 'text-[#ffd600]',
  BUY: 'text-[#00c853]',
  SELL: 'text-[#ff1744]',
};

const SIGNAL_BG = {
  BULLISH: 'bg-[#00c853]/10 border-[#00c853]/20',
  BEARISH: 'bg-[#ff1744]/10 border-[#ff1744]/20',
  NEUTRAL: 'bg-[#ffd600]/10 border-[#ffd600]/20',
  BUY: 'bg-[#00c853]/10 border-[#00c853]/20',
  SELL: 'bg-[#ff1744]/10 border-[#ff1744]/20',
};

const STRENGTH_DOTS = { STRONG: 3, MODERATE: 2, WEAK: 1 };

function StrengthDots({ strength }) {
  const count = STRENGTH_DOTS[strength] || 1;
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= count ? 'bg-[#2979ff]' : 'bg-[#21262d]'}`} />
      ))}
    </div>
  );
}

function Badge({ label, type }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold border ${SIGNAL_BG[type] || 'bg-[#21262d] border-[#21262d]'} ${SIGNAL_COLORS[type] || 'text-[#8b949e]'}`}>
      {label}
    </span>
  );
}

function Section({ icon: Icon, title, children, accent }) {
  return (
    <div className="bg-[#161b22] border border-[#21262d] rounded-xl overflow-hidden">
      <div className={`flex items-center gap-2.5 px-4 py-3 border-b border-[#21262d] ${accent || ''}`}>
        <Icon className="w-4 h-4 text-[#8b949e]" />
        <h3 className="text-sm font-semibold text-[#e6edf3] tracking-wide uppercase">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function RecommendationCard({ rec }) {
  const isBuy = rec.action === 'BUY';
  const isSell = rec.action === 'SELL';
  const color = isBuy ? '#00c853' : isSell ? '#ff1744' : '#ffd600';
  const pulseClass = isBuy ? 'pulse-buy' : isSell ? 'pulse-sell' : '';

  return (
    <div className={`relative bg-[#0d1117] border rounded-xl p-5 overflow-hidden ${isBuy ? 'border-[#00c853]/30' : isSell ? 'border-[#ff1744]/30' : 'border-[#ffd600]/30'}`}>
      <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 70% 50%, ${color}, transparent 60%)` }} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${pulseClass}`}
              style={{ background: `${color}15`, borderColor: `${color}40` }}>
              {isBuy ? <ArrowUpCircle className="w-6 h-6" style={{ color }} />
                : isSell ? <ArrowDownCircle className="w-6 h-6" style={{ color }} />
                : <Minus className="w-6 h-6" style={{ color }} />}
            </div>
            <div>
              <div className="text-2xl font-bold font-mono" style={{ color }}>{rec.action}</div>
              <div className="text-xs text-[#8b949e]">Signal</div>
            </div>
          </div>
          <p className="text-sm text-[#8b949e] leading-relaxed">{rec.summary}</p>
          {rec.keyFactors?.length > 0 && (
            <ul className="mt-3 space-y-1">
              {rec.keyFactors.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#8b949e]">
                  <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color }} />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="text-right">
            <div className="text-3xl font-bold font-mono" style={{ color }}>{rec.confidence}%</div>
            <div className="text-xs text-[#8b949e]">Confidence</div>
          </div>
          <div className="w-16 h-2 bg-[#21262d] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${rec.confidence}%`, background: color }} />
          </div>
          <Badge label={rec.confidenceLabel} type={rec.action} />
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPanel({ data }) {
  const trendIcon = data.trend?.direction === 'UPTREND' ? TrendingUp
    : data.trend?.direction === 'DOWNTREND' ? TrendingDown : Minus;
  const trendColor = data.trend?.direction === 'UPTREND' ? 'text-[#00c853]'
    : data.trend?.direction === 'DOWNTREND' ? 'text-[#ff1744]' : 'text-[#ffd600]';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-[#e6edf3]">{data.symbol || '—'}</span>
              {data.timeframe && (
                <span className="px-2 py-0.5 bg-[#21262d] rounded-md text-xs font-mono text-[#8b949e]">{data.timeframe}</span>
              )}
            </div>
            {data.currentPrice && (
              <div className="text-2xl font-bold font-mono text-[#2979ff] mt-1">{data.currentPrice}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {React.createElement(trendIcon, { className: `w-5 h-5 ${trendColor}` })}
            <div className="text-right">
              <div className={`font-semibold font-mono text-sm ${trendColor}`}>{data.trend?.direction}</div>
              <div className="text-xs text-[#8b949e]">{data.trend?.strength}</div>
            </div>
          </div>
        </div>
        {data.trend?.description && (
          <p className="text-xs text-[#8b949e] mt-3 pt-3 border-t border-[#21262d]">{data.trend.description}</p>
        )}
      </div>

      {/* Recommendation */}
      {data.recommendation && <RecommendationCard rec={data.recommendation} />}

      {/* SL / TP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.stopLoss?.price && (
          <div className="bg-[#161b22] border border-[#ff1744]/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-[#ff1744]" />
              <span className="text-xs font-semibold text-[#ff1744] uppercase tracking-wide">Stop Loss</span>
            </div>
            <div className="text-xl font-bold font-mono text-[#ff1744]">{data.stopLoss.price}</div>
            {data.stopLoss.percentage && (
              <div className="text-xs text-[#8b949e] mt-1">{data.stopLoss.percentage} from entry</div>
            )}
            {data.stopLoss.rationale && (
              <p className="text-xs text-[#8b949e] mt-2 pt-2 border-t border-[#21262d]">{data.stopLoss.rationale}</p>
            )}
          </div>
        )}
        {data.takeProfit?.price && (
          <div className="bg-[#161b22] border border-[#00c853]/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-[#00c853]" />
              <span className="text-xs font-semibold text-[#00c853] uppercase tracking-wide">Take Profit</span>
            </div>
            <div className="text-xl font-bold font-mono text-[#00c853]">{data.takeProfit.price}</div>
            {data.takeProfit.percentage && (
              <div className="text-xs text-[#8b949e] mt-1">{data.takeProfit.percentage} from entry</div>
            )}
            {data.takeProfit.rrRatio && (
              <div className="text-xs font-mono font-semibold text-[#2979ff] mt-1">R:R {data.takeProfit.rrRatio}</div>
            )}
            {data.takeProfit.rationale && (
              <p className="text-xs text-[#8b949e] mt-2 pt-2 border-t border-[#21262d]">{data.takeProfit.rationale}</p>
            )}
          </div>
        )}
      </div>

      {/* Support & Resistance */}
      {((data.supportLevels?.length > 0) || (data.resistanceLevels?.length > 0)) && (
        <Section icon={BarChart2} title="Support & Resistance">
          <div className="space-y-4">
            {data.resistanceLevels?.length > 0 && (
              <div>
                <div className="text-xs text-[#ff1744] uppercase tracking-wider font-semibold mb-2">Resistance</div>
                <div className="space-y-2">
                  {data.resistanceLevels.map((lvl, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-2 bg-[#0d1117] rounded-lg border border-[#21262d]">
                      <div className="flex items-center gap-2">
                        <StrengthDots strength={lvl.strength} />
                        <span className="font-mono text-sm font-semibold text-[#ff1744]">{lvl.price}</span>
                      </div>
                      <span className="text-xs text-[#8b949e] text-right truncate max-w-[140px]">{lvl.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.supportLevels?.length > 0 && (
              <div>
                <div className="text-xs text-[#00c853] uppercase tracking-wider font-semibold mb-2">Support</div>
                <div className="space-y-2">
                  {data.supportLevels.map((lvl, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-2 bg-[#0d1117] rounded-lg border border-[#21262d]">
                      <div className="flex items-center gap-2">
                        <StrengthDots strength={lvl.strength} />
                        <span className="font-mono text-sm font-semibold text-[#00c853]">{lvl.price}</span>
                      </div>
                      <span className="text-xs text-[#8b949e] text-right truncate max-w-[140px]">{lvl.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Patterns */}
      {data.patterns?.length > 0 && (
        <Section icon={Activity} title="Chart Patterns">
          <div className="space-y-2">
            {data.patterns.map((p, i) => (
              <div key={i} className="p-3 bg-[#0d1117] rounded-lg border border-[#21262d]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-[#e6edf3]">{p.name}</span>
                  <Badge label={p.type} type={p.type} />
                </div>
                <p className="text-xs text-[#8b949e]">{p.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Indicators */}
      {data.indicators?.length > 0 && (
        <Section icon={Activity} title="Technical Indicators">
          <div className="grid grid-cols-1 gap-2">
            {data.indicators.map((ind, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-3 bg-[#0d1117] rounded-lg border border-[#21262d]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#e6edf3] font-mono">{ind.name}</span>
                    {ind.value && <span className="text-xs text-[#8b949e] font-mono">{ind.value}</span>}
                  </div>
                  {ind.description && <p className="text-xs text-[#8b949e] mt-1">{ind.description}</p>}
                </div>
                <Badge label={ind.signal} type={ind.signal} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Risks & Warnings */}
      {(data.risks?.length > 0 || data.warnings?.length > 0) && (
        <Section icon={AlertTriangle} title="Risks & Warnings">
          <div className="space-y-2">
            {[...(data.risks || []), ...(data.warnings || [])].map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 bg-[#ffd600]/5 border border-[#ffd600]/10 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-[#ffd600] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#8b949e]">{r}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
