import './style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { Props } from './App';
import { npsConfig } from './utils';
import { useNpsContext } from './hooks';

const DEFAULT_SELECTOR = '#nps-widget';

export function initNPS(props: Partial<Props>) {
  let el = document.querySelector(DEFAULT_SELECTOR);
  if (!el) {
    el = document.createElement('div');
    el.id = DEFAULT_SELECTOR.replace('#', '');
    document.body.appendChild(el);
  }

  const root = ReactDOM.createRoot(el);
  root.render(<App {...props} />);
}

if (typeof window !== 'undefined') {
  (window as any).NPSConfig = {
    init: initNPS,
  };
}

const NPSTelkom = (props: Partial<Props>) => {
  return (
    <div id="nps-widget">
      <App {...props} />
    </div>
  );
};
export { NPSTelkom, npsConfig, useNpsContext };
