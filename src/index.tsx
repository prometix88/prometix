import './style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { NPSWidget, NPSWidgetProps } from '@/NPSWidget';

const DEFAULT_SELECTOR = '#nps-widget';

export function initNPS(props: NPSWidgetProps & { selector?: string }) {
  let el = document.querySelector(props.selector || DEFAULT_SELECTOR);
  if (!el) {
    el = document.createElement('div');
    el.id = (props.selector || DEFAULT_SELECTOR).replace('#', '');
    el.className = 'nps-widget';
    document.body.appendChild(el);
  }

  const root = ReactDOM.createRoot(el);
  root.render(<NPSWidget {...props} />);
}

if (typeof window !== 'undefined') {
  (window as any).NPS = {
    init: initNPS,
  };
}

export { NPSWidget };
