'use client';

// ============================================================
// GaugeChart — Velocímetro SVG animado con color dinámico
// ============================================================

import { useEffect, useRef } from 'react';
import type { NivelRiesgo } from '../../../lib/diagnostico/types';

interface GaugeChartProps {
  score: number;           // 0-100
  nivelRiesgo: NivelRiesgo;
  animated?: boolean;
}

const NIVEL_CONFIG: Record<NivelRiesgo, { color: string; label: string; emoji: string; glow: string; badgeBg: string }> = {
  critico: {
    color: '#EF4444',
    label: 'Incumplimiento Crítico',
    emoji: '🔴',
    glow: 'rgba(239,68,68,0.25)',
    badgeBg: '#FEE2E2',
  },
  en_proceso: {
    color: '#F59E0B',
    label: 'En Proceso',
    emoji: '🟡',
    glow: 'rgba(245,158,11,0.25)',
    badgeBg: '#FEF3C7',
  },
  conforme: {
    color: '#16A34A',
    label: 'Conforme',
    emoji: '🟢',
    glow: 'rgba(22,163,74,0.25)',
    badgeBg: '#DCFCE7',
  },
};

// Gauge arc parameters
const CX = 100;
const CY = 100;
const RADIUS = 75;
const START_ANGLE = -210; // degrees (bottom-left)
const END_ANGLE = 30;     // degrees (bottom-right)
const TOTAL_ANGLE = END_ANGLE - START_ANGLE; // 240 degrees

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
}

export default function GaugeChart({ score, nivelRiesgo, animated = true }: GaugeChartProps) {
  const config = NIVEL_CONFIG[nivelRiesgo];
  const clampedScore = Math.min(100, Math.max(0, score));

  // Arc angles
  const filledEndAngle = START_ANGLE + (clampedScore / 100) * TOTAL_ANGLE;
  const trackPath = describeArc(CX, CY, RADIUS, START_ANGLE, END_ANGLE);
  const fillPath = clampedScore > 0 ? describeArc(CX, CY, RADIUS, START_ANGLE, filledEndAngle) : null;

  // Needle calculation
  const needleAngle = START_ANGLE + (clampedScore / 100) * TOTAL_ANGLE;
  const needleTip = polarToCartesian(CX, CY, RADIUS - 8, needleAngle);
  const needleBase1 = polarToCartesian(CX, CY, 10, needleAngle + 90);
  const needleBase2 = polarToCartesian(CX, CY, 10, needleAngle - 90);

  // Ticks
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* SVG Gauge */}
      <div className="relative">
        <svg
          viewBox="0 0 200 195"
          width="220"
          height="214"
          className="overflow-visible"
          role="img"
          aria-label={`Gauge de cumplimiento: ${clampedScore}%`}
        >
          <defs>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="gauge-track-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <path
            d={trackPath}
            fill="none"
            stroke="url(#gauge-track-grad)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Filled arc */}
          {fillPath && (
            <path
              d={fillPath}
              fill="none"
              stroke={config.color}
              strokeWidth="12"
              strokeLinecap="round"
              filter="url(#glow-filter)"
              className={animated ? 'transition-all duration-700 ease-out' : ''}
              style={{
                filter: `drop-shadow(0 0 6px ${config.glow})`,
              }}
            />
          )}

          {/* Tick marks */}
          {ticks.map((tick) => {
            const angle = START_ANGLE + (tick / 100) * TOTAL_ANGLE;
            const outerPt = polarToCartesian(CX, CY, RADIUS + 10, angle);
            const innerPt = polarToCartesian(CX, CY, RADIUS + 4, angle);
            const labelPt = polarToCartesian(CX, CY, RADIUS + 20, angle);
            return (
              <g key={tick}>
                <line
                  x1={innerPt.x}
                  y1={innerPt.y}
                  x2={outerPt.x}
                  y2={outerPt.y}
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#64748b"
                  fontSize="8"
                  fontFamily="Inter, sans-serif"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Needle */}
          <polygon
            points={`${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
            fill={config.color}
            opacity="0.9"
            className={animated ? 'transition-all duration-700 ease-out' : ''}
            style={{ filter: `drop-shadow(0 0 4px ${config.glow})` }}
          />

          {/* Center hub */}
          <circle cx={CX} cy={CY} r="8" fill="white" stroke={config.color} strokeWidth="2" />
          <circle cx={CX} cy={CY} r="3" fill={config.color} />

          {/* Score display */}
          <text
            x={CX}
            y={CY + 28}
            textAnchor="middle"
            fill={config.color}
            fontSize="22"
            fontWeight="bold"
            fontFamily="Inter, sans-serif"
            className={animated ? 'transition-all duration-500' : ''}
          >
            {clampedScore}%
          </text>
        </svg>
      </div>

      {/* Status badge */}
      <div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold transition-all duration-500"
        style={{
          borderColor: config.color,
          color: config.color,
          background: config.badgeBg,
        }}
      >
        <span>{config.emoji}</span>
        <span>{config.label}</span>
      </div>
    </div>
  );
}
