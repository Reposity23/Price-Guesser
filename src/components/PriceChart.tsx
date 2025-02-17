import React from 'react';
import './PriceChart.css';

interface Props {
  data: number[];
}

const PriceChart: React.FC<Props> = ({ data }) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  const normalizeValue = (value: number) => {
    return ((value - min) / range) * 100;
  };

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - normalizeValue(value);
    return `${x},${y}`;
  }).join(' ');

  const gradientOffset = () => {
    const lastPoint = data[data.length - 1];
    const firstPoint = data[0];
    return lastPoint >= firstPoint ? '0%' : '100%';
  };

  return (
    <div className="chart-container">
      <svg
        className="price-chart"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset={gradientOffset()} stopColor="rgb(34, 197, 94)" />
            <stop offset={gradientOffset()} stopColor="rgb(239, 68, 68)" />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
        />
      </svg>
      <div className="chart-grid">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid-line" style={{ top: `${i * 25}%` }} />
        ))}
      </div>
      <div className="price-labels">
        <span className="price-label">${max.toFixed(2)}</span>
        <span className="price-label">${min.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PriceChart;