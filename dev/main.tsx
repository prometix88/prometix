import ReactDOM from 'react-dom/client';
import { NPSWidget } from '../src/NPSWidget';
import '../src/style.css';

const root = ReactDOM.createRoot(document.getElementById('app')!);

root.render(<NPSWidget question="Preview dari mode dev" />);
