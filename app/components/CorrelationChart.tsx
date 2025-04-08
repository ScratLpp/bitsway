"use client"

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'

// Désactiver le SSR pour ce composant
const CorrelationChart = dynamic(() => Promise.resolve(() => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let plot: any = null

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

    // Utiliser window.Plotly au lieu d'importer plotly.js-dist
    if (containerRef.current && (window as any).Plotly) {
      plot = (window as any).Plotly.newPlot(containerRef.current, data, layout, config)
    }

    return () => {
      if (containerRef.current && plot && (window as any).Plotly) {
        (window as any).Plotly.purge(containerRef.current)
      }
    }
  }, [])

  return (
    <>
      <Script 
        src="https://cdn.plot.ly/plotly-2.27.1.min.js" 
        strategy="afterInteractive"
      />
      <div ref={containerRef} className="w-full h-[400px]" />
    </>
  )
}), { ssr: false })

export default CorrelationChart 