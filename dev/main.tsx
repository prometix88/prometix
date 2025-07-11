import ReactDOM from 'react-dom/client';
import { PrometixProvider } from '../src/index';
import '../src/style.css';

const root = ReactDOM.createRoot(document.getElementById('app')!);

root.render(
  <PrometixProvider
    config={{
      descriptionScore: 'Seberapa besar kemungkinan Anda merekomendasikan situs ini ke teman?',
      hideFeedbackButton: false,
    }}
  />
);
