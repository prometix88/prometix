'use client';

import './style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { type Props } from './App';
import { prometixConfig } from './utils';
import { usePrometix } from './hooks';

export const DEFAULT_SELECTOR = '#prometix';

export function init(
  props: Partial<Omit<Props, 'showFeedbackModal' | 'hideFeedbackModal' | 'children'>>
) {
  let el = document.querySelector(`${DEFAULT_SELECTOR}__container`);
  if (!el) {
    el = document.createElement('div');
    el.id = `${DEFAULT_SELECTOR}__container`.replace('#', '');
    document.body.appendChild(el);
  }

  const root = ReactDOM.createRoot(el);
  root.render(<App {...props} />);
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
    <div id={`${DEFAULT_SELECTOR.replace('#', '')}__container`}>
      <App {...props} />
    </div>
  );
};
export { PrometixProvider, prometixConfig, usePrometix };
