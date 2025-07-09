import { NpsContext } from '../App';
import { useContext } from 'react';

export const useNpsContext = () => {
  const context = useContext(NpsContext);
  if (context === undefined) {
    throw new Error('useNpsContext must be within ModalAlertProvider');
  }
  return context;
};
