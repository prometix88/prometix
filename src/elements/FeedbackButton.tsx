'use client';

import React, { useState } from 'react';
import { feedbackConfig } from '../utils';
import clsx from 'clsx';
import ModalFeedback from './ModalFeedback';
import { useFeedbackUs } from '../hooks';
import ModalSubmitted from './ModalSubmitted';

function FeedbackButton() {
  const [state, setState] = useState({
    showModal: false,
    isSubmitted: false,
    isLoading: false,
  });
  const { config } = useFeedbackUs();

  const handleShowModal = async () => {
    const config = feedbackConfig().get();
    setState({ ...state, isLoading: true });
    try {
      const response = await fetch(config?.api?.check?.url, {
        method: config?.api?.check?.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          survey_id: config?.surveyId,
          customer_id: config?.customerId,
        }),
      });
      const data = await response.json();
      if (data.status === false) {
        return setState({ ...state, showModal: true });
      } else if (data.status === true) {
        return setState({ ...state, isSubmitted: true });
      }
    } catch (error) {
      return error;
    } finally {
      setState({ ...state, isLoading: false });
    }
  };

  if (config.hideFeedbackButton) return null;
  return (
    <>
      <button
        className="fixed right-0 top-1/2 -translate-y-[50%] bg-red-600 cursor-pointer z-[99999999] shadow-2xl px-1 py-3 rounded-ss-lg rounded-se-lg rounded-es-none rounded-ee-none rotate-180 text-white text-base flex items-center gap-1"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
        }}
        onClick={() => handleShowModal()}
      >
        <svg
          className={clsx('transition-all duration-300', {
            'rotate-[-90deg]': !state.showModal,
            'rotate-90': state.showModal,
          })}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {state.isLoading ? 'Loading...' : feedbackConfig().get().textButton}
      </button>

      <ModalFeedback
        show={state.showModal}
        onClose={() => setState({ ...state, showModal: false })}
      />
      <ModalSubmitted
        show={state.isSubmitted}
        onClose={() => setState({ ...state, isSubmitted: false })}
      />
    </>
  );
}

export default FeedbackButton;
