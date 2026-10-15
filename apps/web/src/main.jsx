import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const root = document.getElementById('root');
// The static anonymous snapshot is replaced before restoring browser-local state.
root.removeAttribute('data-prerendered');
document.getElementById('prerender-visibility')?.remove();
ReactDOM.createRoot(root).render(
	<App />
);
