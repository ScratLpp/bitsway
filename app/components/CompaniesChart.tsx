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

export default function CompaniesChart() {
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
            return `${context.dataset.label}: ${context.parsed.y} entreprises`
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
          text: "Nombre d'entreprises",
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
          stepSize: 20
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
    labels: ["2023", "Janvier 2024", "2025"],
    datasets: [
      {
        label: "Entreprises publiques détenant du Bitcoin",
        data: [33, 45, 80],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgb(75, 192, 192)",
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