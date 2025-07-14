import ReactDOM from 'react-dom/client';
import { PrometixProvider } from '../src/index';
import '../src/style.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('app')!);

root.render(
  <PrometixProvider
    config={{
      descriptionScore: 'Seberapa besar kemungkinan Anda merekomendasikan situs ini ke teman?',
      hideFeedbackButton: true,
      surveyId: '1e7b2d1a-c1f0-41c3-9ff9-b60d917e97d4',
      customerId: '1e7b2d1a-c1f0-41c3-9ff9-b60d917e97d8',
    }}
  >
    <App />
  </PrometixProvider>
);
