"use client"

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// Déclaration du type pour Plotly
declare global {
  interface Window {
    Plotly: any;
  }
}

interface MatrixItem {
  x: number;
  y: number;
  value: number;
}

// Fonction pour créer le graphique
const createPlot = (container: HTMLDivElement) => {
  if (!container || typeof window === 'undefined' || !(window as any).Plotly) return null;

  // Données de corrélation pour la heatmap
  const correlationData = [
    [1.00, 0.10, 0.25, 0.35, 0.20], // Bitcoin vs autres
    [0.10, 1.00, 0.15, 0.10, 0.05], // Or vs autres
    [0.25, 0.15, 1.00, 0.85, 0.70], // S&P 500 vs autres
    [0.35, 0.10, 0.85, 1.00, 0.60], // Nasdaq vs autres
    [0.20, 0.05, 0.70, 0.60, 1.00]  // CAC 40 vs autres
  ]

  const assets = ['Bitcoin', 'Or', 'S&P 500', 'Nasdaq', 'CAC 40']

  const data: MatrixItem[] = [
    { x: 0, y: 0, value: 1.0 },
    { x: 1, y: 0, value: 0.2 },
    { x: 2, y: 0, value: -0.1 },
    { x: 0, y: 1, value: 0.2 },
    { x: 1, y: 1, value: 1.0 },
    { x: 2, y: 1, value: 0.3 },
    { x: 0, y: 2, value: -0.1 },
    { x: 1, y: 2, value: 0.3 },
    { x: 2, y: 2, value: 1.0 }
  ];

  const xLabels = ['Bitcoin', 'Or', 'S&P 500', 'Nasdaq', 'CAC 40'];
  const yLabels = ['Bitcoin', 'Or', 'S&P 500', 'Nasdaq', 'CAC 40'];

  const trace = {
    type: 'heatmap' as const,
    x: data.map(item => xLabels[item.x]),
    y: data.map(item => yLabels[item.y]),
    z: data.map(item => item.value),
    colorscale: [
      [0, 'rgb(255, 0, 0)'],
      [0.5, 'rgb(255, 255, 255)'],
      [1, 'rgb(0, 128, 0)']
    ],
    zmin: -1,
    zmax: 1,
    showscale: true,
    colorbar: {
      title: 'Corrélation',
      titleside: 'right',
      titlefont: {
        size: 14,
        family: 'Arial, sans-serif'
      }
    }
  };

  const layout = {
    title: {
      text: 'Matrice de Corrélation',
      font: {
        size: 20,
        family: 'Arial, sans-serif'
      }
    },
    xaxis: {
      title: 'Actifs',
      titlefont: {
        size: 14,
        family: 'Arial, sans-serif'
      }
    },
    yaxis: {
      title: 'Actifs',
      titlefont: {
        size: 14,
        family: 'Arial, sans-serif'
      }
    },
    annotations: data.map(item => ({
      x: xLabels[item.x],
      y: yLabels[item.y],
      text: item.value.toFixed(2),
      font: {
        size: 14,
        color: 'black'
      },
      showarrow: false
    }))
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  return (window as any).Plotly.newPlot(container, [trace], layout, config);
}

// Désactiver le SSR pour ce composant
const CorrelationChart = dynamic(() => Promise.resolve(() => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [plotlyLoaded, setPlotlyLoaded] = useState(false)
  const [plotlyScript, setPlotlyScript] = useState<HTMLScriptElement | null>(null)
  
  // Précharger Plotly.js dès le montage du composant
  useEffect(() => {
    // Vérifier si Plotly est déjà chargé
    if (window.Plotly) {
      setPlotlyLoaded(true);
      return;
    }

    // Créer et ajouter le script si nécessaire
    if (!plotlyScript && !document.querySelector('script[src*="plotly"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-2.27.1.min.js';
      script.async = true;
      script.onload = () => {
        setPlotlyLoaded(true);
      };
      
      document.head.appendChild(script);
      setPlotlyScript(script);
    }

    return () => {
      // Ne pas supprimer le script pour permettre le rechargement
    };
  }, []);

  // Initialiser le graphique une fois que Plotly est chargé
  useEffect(() => {
    if (!plotlyLoaded || !containerRef.current) return;

    createPlot(containerRef.current);
  }, [plotlyLoaded]);

  return (
    <div ref={containerRef} className="w-full h-[400px]" />
  );
}), { ssr: false });

export default CorrelationChart 