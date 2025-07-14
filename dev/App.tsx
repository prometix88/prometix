import { usePrometix } from '../src/index';

function App() {
  const { showFeedbackModal } = usePrometix();
  const handleClick = async () => {
    const payload = {
      surveyId: '1e7b2d1a-c1f0-41c3-9ff9-b60d917e97d4',
      customerId: '1e7b2d1a-c1f0-41c3-9ff9-b60d917e97d8',
    };
    showFeedbackModal(payload);
  };
  return <button onClick={handleClick}>Click Survey</button>;
}

export default App;
