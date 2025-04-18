import React, { useState, useEffect } from 'react';
import { performanceMonitor, formatMetric } from '../utils/performance';

export const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    firstPaint: 0,
    timeToInteractive: 0,
    memoryUsage: 0,
  });

  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics = performanceMonitor.getMetrics();
      setMetrics(newMetrics);
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
      <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span>{formatMetric(metrics.loadTime)}</span>
        </div>
        <div className="flex justify-between">
          <span>First Paint:</span>
          <span>{formatMetric(metrics.firstPaint)}</span>
        </div>
        <div className="flex justify-between">
          <span>Time to Interactive:</span>
          <span>{formatMetric(metrics.timeToInteractive)}</span>
        </div>
        <div className="flex justify-between">
          <span>Memory Usage:</span>
          <span>{formatMetric(metrics.memoryUsage, 'MB')}</span>
        </div>
      </div>
    </div>
  );
}; 