'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GrowthPotentialChart = () => {
  const data = {
    labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Capitalisation Bitcoin (Mds $)',
        data: [3, 6, 200, 70, 130, 500, 1000, 400, 800, 1200],
        backgroundColor: '#f7931a',
        borderColor: '#f7931a',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 16 },
        },
      },
      title: {
        display: true,
        text: 'Évolution de la capitalisation Bitcoin',
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { size: 14 } },
        title: {
          display: true,
          text: 'Capitalisation (Mds $)',
          font: { size: 16 },
        },
      },
      x: {
        ticks: { font: { size: 14 } },
        title: {
          display: true,
          text: 'Année',
          font: { size: 16 },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default GrowthPotentialChart; 