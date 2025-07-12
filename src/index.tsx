'use client';

import './style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { type Props } from './App';
import { prometixConfig } from './utils';
import { usePrometix } from './hooks';

export const DEFAULT_SELECTOR = '#prometix';

function init(props: Partial<Omit<Props, 'showFeedbackModal' | 'hideFeedbackModal' | 'children'>>) {
  let el = document.querySelector(`${DEFAULT_SELECTOR}`);
  if (!el) {
    el = document.createElement('div');
    el.id = `${DEFAULT_SELECTOR}`.replace('#', '');
    document.body.appendChild(el);
  }

  const root = ReactDOM.createRoot(el);
  root.render(<App {...props} embed />);
}

if (typeof window !== 'undefined') {
  (window as any).Prometix = {
    init,
  };
}

const PrometixProvider = (
  props: Partial<Omit<Props, 'showFeedbackModal' | 'hideFeedbackModal'>>
) => {
  return (
    <>
      <App {...props} embed={false} />
    </>
  );
};
export { PrometixProvider, prometixConfig, usePrometix };
