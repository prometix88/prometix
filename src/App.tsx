'use client';

import React, { useEffect, useMemo, useState } from 'react';
import FeedbackButton from './elements/FeedbackButton';
import { feedbackConfig, FeedbackConfig } from './utils';
import ModalFeedback from './elements/ModalFeedback';
import { DEFAULT_SELECTOR } from '.';

interface Payload {
  surveyId: string;
  customerId: string;
}
export interface Props {
  config: Partial<FeedbackConfig>;
  children: React.ReactNode;
  showFeedbackModal: (payload: Payload) => void;
  hideFeedbackModal: () => void;
}
export const FeedbackUsContext = React.createContext<Omit<Props, 'children'> | undefined>(
  undefined
);

function App({ children, ...props }: Partial<Props>) {
  const [state, setState] = useState({
    showModal: false,
  });
  const [dynamicPayload, setDynamicPayload] = useState<Payload>();

  const handleShowModal = async (payload: Payload) => {
    const config = feedbackConfig().get();
    try {
      const response = await fetch(config?.api?.check?.url, {
        method: config?.api?.check?.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          survey_id: payload?.surveyId,
          customer_id: payload?.customerId,
        }),
      });
      const data = await response.json();
      if (data.status === false) {
        setDynamicPayload(payload);
        return setState({ ...state, showModal: true });
      }
      return;
    } catch (error) {
      return error;
    }
  };
  const values = useMemo(
    () => ({
      config: { ...feedbackConfig().get(), ...(props?.config || {}) },
      showFeedbackModal: handleShowModal,
      hideFeedbackModal: () => setState({ ...state, showModal: false }),
    }),
    [props?.config]
  );

  useEffect(() => {
    feedbackConfig().set(values.config);
    (window as any).FeedbackUs.handler = {
      showFeedbackModal: handleShowModal,
      hideFeedbackModal: () => setState({ ...state, showModal: false }),
    };
  }, [values.config]);

  return (
    <FeedbackUsContext.Provider value={values}>
      {children}
      <div id={DEFAULT_SELECTOR.replace('#', '')}>
        <FeedbackButton />
        <ModalFeedback
          show={state.showModal}
          onClose={() => setState({ ...state, showModal: false })}
          payload={dynamicPayload}
        />
      </div>
    </FeedbackUsContext.Provider>
  );
}

export default App;
