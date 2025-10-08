"use client";

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Card } from '@/app/components/ui/card';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement
);

export interface ChartData {
  type: 'pie' | 'bar' | 'line';
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

interface ChartRendererProps {
  data: ChartData;
}

// Predefined color palette for charts
const CHART_COLORS = [
  'rgba(255, 99, 132, 0.8)',   // Red
  'rgba(54, 162, 235, 0.8)',   // Blue
  'rgba(255, 206, 86, 0.8)',   // Yellow
  'rgba(75, 192, 192, 0.8)',   // Green
  'rgba(153, 102, 255, 0.8)',  // Purple
  'rgba(255, 159, 64, 0.8)',   // Orange
  'rgba(199, 199, 199, 0.8)',  // Gray
  'rgba(83, 102, 255, 0.8)',   // Indigo
  'rgba(255, 99, 255, 0.8)',   // Pink
  'rgba(99, 255, 132, 0.8)',   // Light Green
];

const BORDER_COLORS = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(199, 199, 199, 1)',
  'rgba(83, 102, 255, 1)',
  'rgba(255, 99, 255, 1)',
  'rgba(99, 255, 132, 1)',
];

export function ChartRenderer({ data }: ChartRendererProps) {
  const chartRef = useRef(null);

  // Prepare chart data with colors
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, idx) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor ||
        (data.type === 'pie'
          ? CHART_COLORS.slice(0, data.labels.length)
          : CHART_COLORS[idx % CHART_COLORS.length]),
      borderColor: dataset.borderColor ||
        (data.type === 'pie'
          ? BORDER_COLORS.slice(0, data.labels.length)
          : BORDER_COLORS[idx % BORDER_COLORS.length]),
      borderWidth: dataset.borderWidth || 1,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: !!data.title,
        text: data.title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              const value = data.type === 'pie' ? context.parsed : context.parsed.y;
              label += value;

              // Add percentage for pie charts
              if (data.type === 'pie') {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                label += ` (${percentage}%)`;
              }
            }
            return label;
          }
        }
      }
    },
    ...(data.type !== 'pie' && {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 11,
            }
          }
        },
        x: {
          ticks: {
            font: {
              size: 11,
            }
          }
        }
      }
    })
  };

  useEffect(() => {
    // Cleanup chart on unmount
    const currentChart = chartRef.current;
    return () => {
      if (currentChart) {
        const chart = currentChart as { destroy?: () => void };
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      }
    };
  }, []);

  return (
    <Card className="p-6 my-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-2xl mx-auto">
        {data.type === 'pie' && (
          <div className="w-full max-w-md mx-auto">
            <Pie ref={chartRef} data={chartData} options={options} />
          </div>
        )}
        {data.type === 'bar' && (
          <Bar ref={chartRef} data={chartData} options={options} />
        )}
        {data.type === 'line' && (
          <Line ref={chartRef} data={chartData} options={options} />
        )}
      </div>
    </Card>
  );
}

/**
 * Parse chart data from special code blocks in markdown
 * Format: ```chart:TYPE
 * {
 *   "title": "Chart Title",
 *   "labels": ["A", "B", "C"],
 *   "datasets": [{"label": "Data", "data": [1, 2, 3]}]
 * }
 * ```
 */
export function parseChartFromMarkdown(markdown: string): { charts: ChartData[], cleanedMarkdown: string } {
  const charts: ChartData[] = [];
  let cleanedMarkdown = markdown;

  // Match chart code blocks
  const chartRegex = /```chart:(pie|bar|line)\n([\s\S]*?)```/g;
  let match;

  while ((match = chartRegex.exec(markdown)) !== null) {
    const chartType = match[1] as 'pie' | 'bar' | 'line';
    const chartDataStr = match[2].trim();

    try {
      const chartData = JSON.parse(chartDataStr);
      charts.push({
        type: chartType,
        ...chartData,
      });

      // Replace the chart block with a placeholder
      cleanedMarkdown = cleanedMarkdown.replace(match[0], `\n\n__CHART_PLACEHOLDER_${charts.length - 1}__\n\n`);
    } catch (error) {
      console.error('Failed to parse chart data:', error);
    }
  }

  return { charts, cleanedMarkdown };
}
