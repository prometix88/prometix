import React, { useEffect, useMemo, useState } from 'react';
import FeedbackButton from './elements/FeedbackButton';
import { npsConfig, NpsConfig } from './utils';
import ModalFeedback from './elements/ModalFeedback';

export interface Props {
  config: Partial<NpsConfig>;
  children: React.ReactNode;
  showFeedbackModal: () => void;
  hideFeedbackModal: () => void;
}
export const NpsContext = React.createContext<Omit<Props, 'children'> | undefined>(undefined);

function App({ children, ...props }: Partial<Props>) {
  const [state, setState] = useState({
    showModal: false,
  });
  const values = useMemo(
    () => ({
      config: { ...npsConfig().get(), ...(props?.config || {}) },
      showFeedbackModal: () => setState({ ...state, showModal: true }),
      hideFeedbackModal: () => setState({ ...state, showModal: false }),
    }),
    [props?.config]
  );

  useEffect(() => {
    npsConfig().set(values.config);
    (window as any).NPSConfig = {
      showFeedbackModal: () => setState({ ...state, showModal: true }),
      hideFeedbackModal: () => setState({ ...state, showModal: false }),
    };
  }, [values.config]);

  return (
    <NpsContext.Provider value={values}>
      {children}
      <FeedbackButton />
      <ModalFeedback
        show={state.showModal}
        onClose={() => setState({ ...state, showModal: false })}
      />
    </NpsContext.Provider>
  );
}

export default App;
