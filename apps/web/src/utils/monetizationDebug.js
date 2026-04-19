export const checkMonetizationStatus = () => {
  const timestamp = new Date().toISOString();
  const scriptExists = !!document.getElementById('monetag-multitag');
  const quge5Exists = typeof window !== 'undefined' && !!window.quge5;
  const adContainers = document.querySelectorAll('[data-ad-type="multitag"]').length;

  const status = {
    script_loaded: scriptExists,
    window_quge5: quge5Exists,
    ad_containers: adContainers,
    timestamp
  };

  console.log(`[${timestamp}] Monetag Status Check:`, status);
  return status;
};