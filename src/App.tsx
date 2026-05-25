'use client';

import React, { useEffect, useMemo, useState } from 'react';
import FeedbackButton from './elements/FeedbackButton';
import { prometixConfig, FeedbackConfig } from './utils';
import ModalFeedback from './elements/ModalFeedback';
import ModalSubmitted from './elements/ModalSubmitted';
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
  survey_type?: string;
  color?: string;
}
export interface Props {
  config: Partial<FeedbackConfig>;
  children: React.ReactNode;
  showFeedbackModal: (
    payload: Payload,
    options?: OptionModal,
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
  undefined,
);

function App({ children, embed, ...props }: Partial<Props> & { embed?: boolean }) {
  const [state, setState] = useState({
    showModal: false,
    hasSubmittedFeedback: false,
  });
  const [dynamicPayload, setDynamicPayload] = useState<Payload>();
  const [optionsModal, setOptionsModal] = useState<OptionModal>();
  const [infoModal, setInfoModal] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

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
      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`);
      }
      try {
        const content = await getContentSurvey(payload?.surveyId);
        setOptionsModal({
          descriptionScore: options?.descriptionScore,
          title: options?.title || content?.data?.question,
          thankyou: options?.thankyou || content?.data?.thank_you_message,
          illustration: options?.illustration,
          followupQuestion: options?.followupQuestion || content?.data?.follow_up_question,
          survey_type: content?.data?.survey_type,
          color: content?.data?.color,
        });
        setDynamicPayload(payload);
        setState({ ...state, showModal: true });
        return Promise.resolve({
          submitted: false,
        });
      } catch (contentError: any) {
        setInfoModal({ show: true, message: contentError?.message || 'Survey tidak ditemukan' });
        return Promise.resolve({
          submitted: null,
          error: contentError?.message || 'Survey not found',
        });
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Terjadi kesalahan';
      const isAlready = errorMessage.toLowerCase().includes('already');
      if (isAlready) {
        setState((prev) => ({ ...prev, hasSubmittedFeedback: true }));
      }
      setInfoModal({ show: true, message: errorMessage });
      return Promise.resolve({
        submitted: null,
        error: errorMessage,
      });
    }
  };
  const values = useMemo(
    () => ({
      config: { ...prometixConfig().get(), ...(props?.config || {}) },
      showFeedbackModal: handleShowModal,
      hideFeedbackModal: () => setState({ ...state, showModal: false }),
    }),
    [props?.config],
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
          {!state.hasSubmittedFeedback && <FeedbackButton />}
          <ModalFeedback
            show={state.showModal}
            onClose={() => setState({ ...state, showModal: false })}
            onSuccess={() => setState({ ...state, hasSubmittedFeedback: true })}
            payload={dynamicPayload}
            optionsModal={optionsModal}
          />
          <ModalSubmitted
            show={infoModal.show}
            onClose={() => setInfoModal({ ...infoModal, show: false })}
            message={infoModal.message}
          />
        </>
      ) : (
        createPortal(
          <div id={DEFAULT_SELECTOR.replace('#', '')}>
            {!state.hasSubmittedFeedback && <FeedbackButton />}
            <ModalFeedback
              show={state.showModal}
              onClose={() => setState({ ...state, showModal: false })}
              onSuccess={() => setState({ ...state, hasSubmittedFeedback: true })}
              payload={dynamicPayload}
              optionsModal={optionsModal}
            />
            <ModalSubmitted
              show={infoModal.show}
              onClose={() => setInfoModal({ ...infoModal, show: false })}
              message={infoModal.message}
            />
          </div>,
          document.body,
        )
      )}
    </FeedbackUsContext.Provider>
  );
}

export default App;
