import { useEffect } from 'react';

export default function AdManager() {
  useEffect(() => {
    const scriptId = 'monetag-vignette-script';
    
    // Load script exactly once
    if (!document.getElementById(scriptId)) {
      console.log('AdManager: Loading Monetag vignette script...');
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://gizokraijaw.net/vignette.min.js';
      script.dataset.zone = '10667199';
      script.async = true;
      document.body.appendChild(script);
    } else {
      console.log('AdManager: Vignette script already loaded.');
    }

    // Scroll detection to trigger vignette
    const handleScroll = () => {
      console.log('AdManager: First scroll interaction detected. Vignette ready to trigger.');
      // Remove listener after first scroll to prevent spamming
      window.removeEventListener('scroll', handleScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null; // No UI rendering
}