'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PortfolioDiversificationChart = () => {
  const data = {
    labels: ['Bitcoin', 'Actions', 'Obligations', 'Immobilier', 'Cash'],
    datasets: [
      {
        data: [20, 30, 25, 15, 10],
        backgroundColor: [
          '#f7931a', // Bitcoin orange
          '#4CAF50', // Vert pour les actions
          '#2196F3', // Bleu pour les obligations
          '#9C27B0', // Violet pour l'immobilier
          '#FFC107', // Jaune pour le cash
        ],
        borderColor: [
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
        ],
        borderWidth: 2,
        spacing: 10, // Augmentation de l'espacement entre les segments
        offset: 5, // Ajout d'un offset pour éviter la superposition
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permet un meilleur contrôle de la taille
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: { size: 16 },
          padding: 30, // Augmentation du padding pour la légende
          boxWidth: 20, // Réduction de la largeur des boîtes de légende
        },
      },
      title: {
        display: true,
        text: 'Diversification optimale du portefeuille',
        font: { size: 18 },
      },
    },
    layout: {
      padding: {
        right: 80, // Augmentation du padding à droite pour la légende
      },
    },
    cutout: '60%', // Augmentation de l'espace central
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PortfolioDiversificationChart; 