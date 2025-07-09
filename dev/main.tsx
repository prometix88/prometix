import ReactDOM from 'react-dom/client';
import { NPSTelkom } from '../src/index';
import '../src/style.css';

const root = ReactDOM.createRoot(document.getElementById('app')!);

root.render(<NPSTelkom descriptionScore="Dari 1 (buruk) hingga 10 (sangat baik)" />);
