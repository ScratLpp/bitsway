'use client';

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js"
import annotationPlugin from "chartjs-plugin-annotation"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
)

export default function InflationChart() {
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 14,
          },
          color: "#666666",
        },
      },
      annotation: {
        annotations: {
          inflationAnnotation: {
            type: "label",
            xValue: 4,
            yValue: 801,
            backgroundColor: "rgba(75, 192, 192, 0.8)",
            content: "801€",
            font: {
              size: 14,
            },
            borderRadius: 4,
            xAdjust: -30,
            yAdjust: -30,
            display: (ctx) => {
              const meta = ctx.chart.getDatasetMeta(0)
              return !meta.hidden
            },
          },
          bitcoinAnnotation: {
            type: "label",
            xValue: 4,
            yValue: 5960,
            backgroundColor: "rgba(255, 99, 132, 0.8)",
            content: "5960€",
            font: {
              size: 14,
            },
            borderRadius: 4,
            xAdjust: -70,
            yAdjust: 30,
            display: (ctx) => {
              const meta = ctx.chart.getDatasetMeta(1)
              return !meta.hidden
            },
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Valeur (€)",
          font: {
            size: 12,
            weight: "bold",
          },
          color: "#666666",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#666666",
          font: {
            size: 12,
          },
          callback: function(value) {
            return value.toLocaleString('fr-FR') + '€'
          }
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#666666",
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: "Années",
          font: {
            size: 12,
            weight: "bold",
          },
          color: "#666666",
        },
        border: {
          display: false,
        },
      },
    },
  }

  const data: ChartData<"line"> = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Pouvoir d'achat avec inflation",
        data: [1000, 930, 874, 830, 801],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.4,
      },
      {
        label: "Valeur en Bitcoin",
        data: [1000, 3417, 2292, 3152, 5960],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
      },
    ],
  }

  return (
    <div className="w-full h-[400px]">
      <Line options={options} data={data} />
    </div>
  )
} 