"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface GaugeChartProps {
  value: number;
  isAnimating: boolean;
  playerA: string;
  playerB: string;
}

export default function GaugeChart({
  value,
  isAnimating,
  playerA,
  playerB,
}: GaugeChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    chartInstanceRef.current = echarts.init(chartRef.current, undefined, {
      renderer: "canvas",
    });

    const handleResize = () => chartInstanceRef.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartInstanceRef.current) {
      return;
    }

    chartInstanceRef.current.setOption({
      backgroundColor: "transparent",
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 10,
          radius: "92%",
          center: ["50%", "74%"],
          axisLine: {
            lineStyle: {
              width: 22,
              color: [
                [
                  0.5,
                  new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#e63946" },
                    { offset: 1, color: "#ff8a93" },
                  ]),
                ],
                [
                  1,
                  new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#6eb0de" },
                    { offset: 1, color: "#1d3557" },
                  ]),
                ],
              ],
            },
          },
          pointer: {
            icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
            length: "64%",
            width: 14,
            offsetCenter: [0, "-10%"],
            itemStyle: {
              color: "#f4d03f",
              shadowColor: "rgba(244, 208, 63, 0.75)",
              shadowBlur: 14,
            },
          },
          axisTick: {
            length: 8,
            lineStyle: { color: "#90a3bf", width: 1 },
          },
          splitLine: {
            length: 16,
            lineStyle: { color: "#90a3bf", width: 2 },
          },
          axisLabel: {
            color: "#d8e0ec",
            fontSize: 11,
            distance: -42,
            formatter: (rawValue: number) => {
              if (rawValue === 0) {
                return playerA || "甲方";
              }
              if (rawValue === 100) {
                return playerB || "乙方";
              }
              return "";
            },
          },
          title: {
            offsetCenter: [0, "-28%"],
            fontSize: 14,
            color: "#f4d03f",
          },
          detail: {
            valueAnimation: true,
            formatter: (currentValue: number) => {
              const scoreA = 100 - currentValue;
              const scoreB = currentValue;
              return `{a|${scoreA}%}  {sep|vs}  {b|${scoreB}%}`;
            },
            rich: {
              a: {
                color: "#ff8a93",
                fontSize: 22,
                fontWeight: "bold",
              },
              sep: {
                color: "#8f9fb2",
                fontSize: 12,
              },
              b: {
                color: "#9fd3ff",
                fontSize: 22,
                fontWeight: "bold",
              },
            },
            offsetCenter: [0, "-4%"],
          },
          data: [
            {
              value,
              name: isAnimating ? "分析进行中" : "分析结果",
            },
          ],
        },
      ],
    });
  }, [isAnimating, playerA, playerB, value]);

  return <div ref={chartRef} className="h-72 w-full sm:h-80" />;
}
