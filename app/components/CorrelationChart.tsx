"use client"

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Déclaration du type pour Plotly
declare global {
  interface Window {
    Plotly: any;
  }
}

// Fonction pour créer le graphique
const createPlot = (container: HTMLElement) => {
  const correlationData = [
    [1.0, 0.2, -0.1, -0.2, -0.3],
    [0.2, 1.0, 0.3, 0.2, 0.1],
    [-0.1, 0.3, 1.0, 0.8, 0.7],
    [-0.2, 0.2, 0.8, 1.0, 0.9],
    [-0.3, 0.1, 0.7, 0.9, 1.0]
  ];

  const assets = ['Bitcoin', 'Or', 'S&P 500', 'Nasdaq', 'CAC 40'];

  const data: any = [{
    z: correlationData,
    x: assets,
    y: assets,
    type: 'heatmap',
    colorscale: [
      [0, 'rgb(250, 220, 200)'],
      [0.2, 'rgb(245, 160, 130)'],
      [0.4, 'rgb(235, 110, 100)'],
      [0.6, 'rgb(220, 70, 80)'],
      [0.8, 'rgb(200, 30, 60)'],
      [1, 'rgb(180, 0, 39)']
    ],
    showscale: true,
    text: correlationData.map(row => row.map(value => value.toFixed(2))),
    texttemplate: '%{text}',
    textfont: { color: 'white', size: 12, family: 'Arial, sans-serif' },
    hoverongaps: false,
    hovertemplate: '%{y} vs %{x}: %{z:.2f}<extra></extra>'
  }];

  const layout: any = {
    title: {
      text: 'Heatmap de corrélation entre actifs',
      font: {
        size: 16,
        color: '#666666'
      },
      y: 1.1,
      pad: { t: 0, b: 0 }
    },
    margin: { 
      t: 30,
      l: 70,
      r: 10,
      b: 50,
      pad: 0
    },
    xaxis: {
      side: 'bottom',
      tickfont: {
        size: 12,
        color: '#666666'
      }
    },
    yaxis: {
      tickfont: {
        size: 12,
        color: '#666666'
      }
    }
  };

  const config: any = {
    displayModeBar: false,
    responsive: true
  };

  return window.Plotly.newPlot(container, data, layout, config);
};

const CorrelationChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const checkPlotlyAndCreate = () => {
      if (window.Plotly) {
        createPlot(containerRef.current!);
        return true;
      }
      return false;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!checkPlotlyAndCreate()) {
              // Si Plotly n'est pas encore chargé, on vérifie toutes les 100ms
              const interval = setInterval(() => {
                if (checkPlotlyAndCreate()) {
                  clearInterval(interval);
                }
              }, 100);

              // On arrête de vérifier après 5 secondes pour éviter une boucle infinie
              setTimeout(() => clearInterval(interval), 5000);
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-[400px] px-0 sm:px-4">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default CorrelationChart 