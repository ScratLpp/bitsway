'use client';

import { useEffect } from 'react';

const PlotlyPreloader = () => {
  useEffect(() => {
    // Vérifier si le script est déjà présent
    if (document.querySelector('script[src*="plotly"]')) {
      return;
    }

    // Créer et ajouter le script
    const script = document.createElement('script');
    script.src = 'https://cdn.plot.ly/plotly-2.27.1.min.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return null;
};

export default PlotlyPreloader; 