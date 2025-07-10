'use client';

import './style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { type Props } from './App';
import { feedbackConfig } from './utils';
import { useFeedbackUs } from './hooks';

export const DEFAULT_SELECTOR = '#feedback-us';

export function init(
  props: Partial<Omit<Props, 'showFeedbackModal' | 'hideFeedbackModal' | 'children'>>
) {
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
  (window as any).FeedbackUs = {
    init,
  };
}

const FeedbackUsProvider = (
  props: Partial<Omit<Props, 'showFeedbackModal' | 'hideFeedbackModal'>>
) => {
  return (
    <div id={DEFAULT_SELECTOR.replace('#', '')}>
      <App {...props} />
    </div>
  );
};
export { FeedbackUsProvider, feedbackConfig, useFeedbackUs };
