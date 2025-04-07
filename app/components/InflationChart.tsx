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
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const labels = ['2020', '2021', '2022', '2023', '2024', '2025'];
        const inflationData = [1000, 930, 874, 830, 801, 777];
        const bitcoinData = [1000, 4028, 6667, 2292, 5833, 9861];

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
                }
              },
              annotation: {
                annotations: {
                  inflationValue: {
                    type: 'label',
                    xValue: 5,
                    yValue: 777,
                    content: '777€',
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
                    yAdjust: -15
                  },
                  bitcoinValue: {
                    type: 'label',
                    xValue: 5,
                    yValue: 9861,
                    content: '9861€',
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
                    yAdjust: 0
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

    // Cleanup function
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