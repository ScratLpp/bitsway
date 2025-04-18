"use client"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function GrowthChart() {
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
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
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString('fr-FR')}€`
          }
        }
      }
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Capitalisation (€)",
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

  const data: ChartData<"bar"> = {
    labels: [
      "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"
    ],
    datasets: [
      {
        label: "Capitalisation totale de Bitcoin",
        data: [
          15500000000, 451400000000, 105400000000, 159500000000, 
          530700000000, 755600000000, 300800000000, 520000000000, 
          1726500000000
        ],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="w-full h-[400px]">
      <Bar options={options} data={data} />
    </div>
  )
} 