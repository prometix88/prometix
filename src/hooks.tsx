import { FeedbackUsContext } from './App';
import { useContext } from 'react';

export const useFeedbackUs = () => {
  const context = useContext(FeedbackUsContext);
  if (context === undefined) {
    throw new Error('useFeedbackUs must be within FeedbackUsProvider');
  }
  return context;
};
