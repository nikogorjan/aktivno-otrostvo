import Script from 'next/script'
import React from 'react'
import { defaultTheme, themeLocalStorageKey } from '../shared'

export const InitTheme: React.FC = () => (
  <Script
    id="theme-script"
    strategy="beforeInteractive"
    dangerouslySetInnerHTML={{
      __html: `
(function () {
  function valid(t){return t==='light'||t==='dark'}
  var stored=null; try{stored=localStorage.getItem('${themeLocalStorageKey}')}catch(_){}
  // Respect 'light' only; otherwise force default (light)
  var theme = stored==='light' ? 'light' : '${defaultTheme}';
  // Optional: clear old 'dark' choice so future loads don't try to switch
  if (stored==='dark') { try{ localStorage.removeItem('${themeLocalStorageKey}'); }catch(_){ } }
  document.documentElement.setAttribute('data-theme', theme);
})();
      `.trim(),
    }}
  />
)
