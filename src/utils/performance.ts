interface PerformanceMetrics {
  loadTime: number;
  firstPaint: number;
  timeToInteractive: number;
  memoryUsage: number;
}

export const getPerformanceMetrics = (): PerformanceMetrics => {
  const timing = performance.timing;
  const memory = (performance as any).memory;

  return {
    loadTime: timing.loadEventEnd - timing.navigationStart,
    firstPaint: timing.domLoading - timing.navigationStart,
    timeToInteractive: timing.domInteractive - timing.navigationStart,
    memoryUsage: memory ? memory.usedJSHeapSize / (1024 * 1024) : 0, // Convert to MB
  };
};

export const formatMetric = (value: number, unit: string = 'ms'): string => {
  return `${value.toFixed(2)} ${unit}`;
};

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    firstPaint: 0,
    timeToInteractive: 0,
    memoryUsage: 0
  };

  private constructor() {
    this.initializeMetrics();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeMetrics() {
    // Capture initial load metrics
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.now();
      
      // Capture First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.firstPaint = fcpEntry.startTime;
      }

      // Capture Time to Interactive
      const ttiEntry = performance.getEntriesByType('longtask');
      if (ttiEntry.length > 0) {
        this.metrics.timeToInteractive = ttiEntry[ttiEntry.length - 1].startTime + ttiEntry[ttiEntry.length - 1].duration;
      }

      // Capture memory usage if available
      if ('memory' in performance) {
        // @ts-ignore
        this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
      }
    });
  }

  public getMetrics(): PerformanceMetrics {
    return this.metrics;
  }

  public measureComponentRender(componentName: string) {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const duration = end - start;
      console.log(`[Performance] ${componentName} render time: ${duration.toFixed(2)}ms`);
      return duration;
    };
  }

  public logMetrics() {
    console.log('Performance Metrics:', this.metrics);
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Hook untuk mengukur performa komponen
export function usePerformanceMeasure(componentName: string) {
  const measure = useCallback(() => {
    return performanceMonitor.measureComponentRender(componentName);
  }, [componentName]);

  return measure;
} 