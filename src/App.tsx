'use client';

import React, { useEffect, useMemo, useState } from 'react';
import FeedbackButton from './elements/FeedbackButton';
import { prometixConfig, FeedbackConfig } from './utils';
import ModalFeedback from './elements/ModalFeedback';
import { DEFAULT_SELECTOR } from '.';
import { createPortal } from 'react-dom';
import { getContentSurvey } from './services';

interface Payload {
  surveyId: string;
  customerId: string;
  meta?: Record<string, any>;
}
interface OptionModal {
  title?: string;
  descriptionScore?: string;
  thankyou?: string;
  illustration?: string;
  followupQuestion?: string;
}
export interface Props {
  config: Partial<FeedbackConfig>;
  children: React.ReactNode;
  showFeedbackModal: (
    payload: Payload,
    options?: OptionModal
  ) => Promise<
    | {
        submitted: boolean;
      }
    | {
        submitted: null;
        error: any;
      }
  >;
  hideFeedbackModal: () => void;
}
export const FeedbackUsContext = React.createContext<Omit<Props, 'children'> | undefined>(
  undefined
);

function App({ children, embed, ...props }: Partial<Props> & { embed?: boolean }) {
  const [state, setState] = useState({
    showModal: false,
  });
  const [dynamicPayload, setDynamicPayload] = useState<Payload>();
  const [optionsModal, setOptionsModal] = useState<OptionModal>();

  const handleShowModal = async (payload: Payload, options?: OptionModal) => {
    const config = prometixConfig().get();
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
        const content = await getContentSurvey(payload?.surveyId);
        setOptionsModal({
          descriptionScore: options?.descriptionScore,
          title: options?.title || content?.data?.question,
          thankyou: options?.thankyou || content?.data?.thank_you_message,
          illustration: options?.illustration,
          followupQuestion: options?.followupQuestion || content?.data?.follow_up_question,
        });
        setDynamicPayload(payload);
        setState({ ...state, showModal: true });
        return Promise.resolve({
          submitted: false,
        });
      } else if (data.status === true) {
        return Promise.resolve({
          submitted: true,
        });
      }
      return Promise.resolve({
        submitted: null,
        error: data?.error || 'Unknown error',
      });
    } catch (error: any) {
      return Promise.resolve({
        submitted: null,
        error: error?.message || 'Unknown error',
      });
    }
  };
  const values = useMemo(
    () => ({
      config: { ...prometixConfig().get(), ...(props?.config || {}) },
      showFeedbackModal: handleShowModal,
      hideFeedbackModal: () => setState({ ...state, showModal: false }),
    }),
    [props?.config]
  );

  useEffect(() => {
    prometixConfig().set(values.config);
    (window as any).Prometix.handler = {
      showFeedbackModal: handleShowModal,
      hideFeedbackModal: () => setState({ ...state, showModal: false }),
    };
  }, [values.config]);

  return (
    <FeedbackUsContext.Provider value={values}>
      {children}
      {embed ? (
        <>
          <FeedbackButton />
          <ModalFeedback
            show={state.showModal}
            onClose={() => setState({ ...state, showModal: false })}
            payload={dynamicPayload}
            optionsModal={optionsModal}
          />
        </>
      ) : (
        createPortal(
          <div id={DEFAULT_SELECTOR.replace('#', '')}>
            <FeedbackButton />
            <ModalFeedback
              show={state.showModal}
              onClose={() => setState({ ...state, showModal: false })}
              payload={dynamicPayload}
              optionsModal={optionsModal}
            />
          </div>,
          document.body
        )
      )}
    </FeedbackUsContext.Provider>
  );
}

export default App;
