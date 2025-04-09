"use client"

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

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
  }]

  const layout: any = {
    title: {
      text: 'Heatmap de corrélation entre actifs',
      font: {
        size: 16,
        color: '#666666'
      },
      y: 0.95
    },
    margin: { t: 50, l: 80, r: 30, b: 80 },
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
  }

  const config: any = {
    displayModeBar: false,
    responsive: true
  }

  return (window as any).Plotly.newPlot(container, data, layout, config);
}

// Désactiver le SSR pour ce composant
const CorrelationChart = dynamic(() => Promise.resolve(() => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [plotlyLoaded, setPlotlyLoaded] = useState(false)
  const [plotlyScript, setPlotlyScript] = useState<HTMLScriptElement | null>(null)
  
  // Fonction pour initialiser Plotly et créer le graphique
  const initPlotly = () => {
    if (containerRef.current && (window as any).Plotly) {
      // Nettoyer tout graphique précédent
      try {
        (window as any).Plotly.purge(containerRef.current);
      } catch (e) {
        // Ignorer les erreurs de nettoyage
      }
      
      // Créer le nouveau graphique
      createPlot(containerRef.current);
      setPlotlyLoaded(true);
    }
  }

  // Gérer le chargement initial de Plotly via un script
  useEffect(() => {
    // Vérifie si Plotly est déjà chargé
    if ((window as any).Plotly) {
      setPlotlyLoaded(true);
      initPlotly();
      return;
    }

    // Créer et ajouter le script si nécessaire
    if (!plotlyScript && !document.querySelector('script[src*="plotly"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-2.27.1.min.js';
      script.async = true;
      script.onload = () => {
        setPlotlyLoaded(true);
        initPlotly();
      };
      
      document.head.appendChild(script);
      setPlotlyScript(script);
    }

    return () => {
      // Ne pas supprimer le script pour permettre le rechargement
    };
  }, []);

  // Effet pour créer/redessiner le graphique lorsque Plotly est chargé ou le conteneur change
  useEffect(() => {
    if (plotlyLoaded && containerRef.current) {
      initPlotly();
    }

    return () => {
      if (containerRef.current && (window as any).Plotly) {
        try {
          (window as any).Plotly.purge(containerRef.current);
        } catch (e) {
          // Ignorer les erreurs de nettoyage
        }
      }
    };
  }, [plotlyLoaded, containerRef.current]);

  // Effet pour dessiner le graphique lorsque le composant devient visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && plotlyLoaded && containerRef.current) {
            initPlotly();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [plotlyLoaded]);

  return (
    <div ref={containerRef} className="w-full h-[400px]" />
  );
}), { ssr: false });

export default CorrelationChart 