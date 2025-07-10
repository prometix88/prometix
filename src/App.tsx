'use client';

import React, { useEffect, useMemo, useState } from 'react';
import FeedbackButton from './elements/FeedbackButton';
import { feedbackConfig, FeedbackConfig } from './utils';
import ModalFeedback from './elements/ModalFeedback';

export interface Props {
  config: Partial<FeedbackConfig>;
  children: React.ReactNode;
  showFeedbackModal: () => void;
  hideFeedbackModal: () => void;
}
export const FeedbackUsContext = React.createContext<Omit<Props, 'children'> | undefined>(
  undefined
);

function App({ children, ...props }: Partial<Props>) {
  const [state, setState] = useState({
    showModal: false,
  });
  const values = useMemo(
    () => ({
      config: { ...feedbackConfig().get(), ...(props?.config || {}) },
      showFeedbackModal: () => setState({ ...state, showModal: true }),
      hideFeedbackModal: () => setState({ ...state, showModal: false }),
    }),
    [props?.config]
  );

  useEffect(() => {
    feedbackConfig().set(values.config);
    (window as any).FeedbackUs.handler = {
      showFeedbackModal: () => setState({ ...state, showModal: true }),
      hideFeedbackModal: () => setState({ ...state, showModal: false }),
    };
  }, [values.config]);

  return (
    <FeedbackUsContext.Provider value={values}>
      {children}
      <FeedbackButton />
      <ModalFeedback
        show={state.showModal}
        onClose={() => setState({ ...state, showModal: false })}
      />
    </FeedbackUsContext.Provider>
  );
}

export default App;
