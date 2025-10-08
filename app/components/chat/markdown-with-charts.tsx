"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ChartRenderer, parseChartFromMarkdown } from "./chart-renderer";

interface MarkdownWithChartsProps {
  content: string;
}

export function MarkdownWithCharts({ content }: MarkdownWithChartsProps) {
  // Parse charts from markdown
  const { charts, cleanedMarkdown } = parseChartFromMarkdown(content);

  // Split markdown by chart placeholders
  const parts = cleanedMarkdown.split(/(__CHART_PLACEHOLDER_\d+__)/g);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {parts.map((part, index) => {
        // Check if this part is a chart placeholder
        const chartMatch = part.match(/__CHART_PLACEHOLDER_(\d+)__/);

        if (chartMatch) {
          const chartIndex = parseInt(chartMatch[1], 10);
          const chart = charts[chartIndex];

          if (chart) {
            return <ChartRenderer key={`chart-${index}`} data={chart} />;
          }
        }

        // Regular markdown content
        return (
          <ReactMarkdown
            key={`markdown-${index}`}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-slate-800 text-slate-100 px-1 py-0.5 rounded text-xs" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {part}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
