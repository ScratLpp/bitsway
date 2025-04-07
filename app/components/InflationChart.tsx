'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

export default function InflationChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const labels = ['2020', '2021', '2022', '2023', '2024'];
        const inflationData = [1000, 930, 874, 830, 801];
        const bitcoinData = [1000, 3417, 2292, 3152, 5960];

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Pouvoir d\'achat avec inflation',
                data: inflationData,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.3
              },
              {
                label: 'Valeur en Bitcoin',
                data: bitcoinData,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  font: {
                    size: 14,
                    family: "'Inter', sans-serif"
                  }
                },
                onClick: (e, legendItem, legend) => {
                  const index = legendItem.datasetIndex;
                  if (index !== undefined) {
                    const ci = legend.chart;
                    const meta = ci.getDatasetMeta(index);
                    
                    // Toggle visibility
                    meta.hidden = meta.hidden === null ? true : !meta.hidden;
                    
                    // Update chart
                    ci.update();
                  }
                }
              },
              annotation: {
                annotations: {
                  inflationValue: {
                    type: 'label',
                    xValue: 4,
                    yValue: 801,
                    content: '801€',
                    position: 'end',
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    color: 'white',
                    font: {
                      size: 12,
                      family: "'Inter', sans-serif"
                    },
                    padding: 4,
                    borderRadius: 4,
                    xAdjust: -15,
                    yAdjust: -15,
                    drawTime: 'afterDatasetsDraw',
                    display: (ctx) => {
                      const chart = ctx.chart;
                      const meta = chart.getDatasetMeta(0);
                      return meta.hidden !== true;
                    }
                  },
                  bitcoinValue: {
                    type: 'label',
                    xValue: 4,
                    yValue: 5960,
                    content: '5960€',
                    position: 'start',
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    color: 'white',
                    font: {
                      size: 12,
                      family: "'Inter', sans-serif"
                    },
                    padding: 4,
                    borderRadius: 4,
                    xAdjust: -80,
                    yAdjust: 15,
                    drawTime: 'afterDatasetsDraw',
                    display: (ctx) => {
                      const chart = ctx.chart;
                      const meta = chart.getDatasetMeta(1);
                      return meta.hidden !== true;
                    }
                  }
                }
              }
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Valeur (€)',
                  font: {
                    size: 16,
                    family: "'Inter', sans-serif"
                  }
                },
                ticks: {
                  font: {
                    size: 14,
                    family: "'Inter', sans-serif"
                  }
                }
              },
              x: {
                ticks: {
                  font: {
                    size: 14,
                    family: "'Inter', sans-serif"
                  }
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-[400px]">
      <canvas ref={chartRef} />
    </div>
  );
} 