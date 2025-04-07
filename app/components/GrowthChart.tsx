"use client"

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function GrowthChart() {
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
    labels: [
      "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017",
      "2018", "2019", "2020", "2021", "2022", "2023", "2024"
    ],
    datasets: [
      {
        label: "Prix moyen annuel de Bitcoin",
        data: [
          0.1, 0.3, 5.3, 7.5, 770, 950, 430, 950, 14000,
          8200, 7200, 8727, 29825, 20000, 27500, 52000
        ],
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