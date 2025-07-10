import ReactDOM from 'react-dom/client';
import { FeedbackUsProvider } from '../src/index';
import '../src/style.css';

const root = ReactDOM.createRoot(document.getElementById('app')!);

root.render(
  <FeedbackUsProvider
    config={{
      descriptionScore: 'Seberapa besar kemungkinan Anda merekomendasikan situs ini ke teman?',
      hideFeedbackButton: false,
    }}
  />
);
