'use client';

import React, { useEffect, useState } from 'react';
import { generateColors, prometixConfig } from '../utils';
import clsx from 'clsx';
import { usePrometix } from '../hooks';
import ModalSubmitted from './ModalSubmitted';
import { getContentSurvey } from '../services';

function FeedbackButton() {
  const [state, setState] = useState({
    showModal: false,
    isSubmitted: false,
    isLoading: false,
  });
  const { config, showFeedbackModal } = usePrometix();
  const [style, setStyle] = useState<{
    backgroundColor?: string;
    color?: string;
    border?: string;
    borderLeft?: string;
  }>();

  const handleOpenModal = async () => {
    const config = prometixConfig().get();
    setState({ ...state, isLoading: true });
    try {
      const checkSurvey = await showFeedbackModal({
        customerId: config?.customerId,
        surveyId: config?.surveyId,
      });
      // Check if the survey has been submitted
      if (checkSurvey.submitted === true) {
        setState({ ...state, isSubmitted: true, isLoading: false });
        return;
      }
      setState({ ...state, isLoading: false });
    } catch (error) {
      setState({ ...state, isLoading: false });
      return error;
    }
  };

  useEffect(() => {
    if (!config.hideFeedbackButton && !!config?.surveyId) {
      (async () => {
        try {
          const content = await getContentSurvey(config?.surveyId!);
          setStyle({
            backgroundColor: generateColors(content?.data?.color).backgroundColor,
            color: generateColors(content?.data?.color).textColor,
            border: generateColors(content?.data?.color).isDark
              ? undefined
              : `1px solid ${generateColors(content?.data?.color).textColor}`,
            borderLeft: 'none',
          });
        } catch (error) {}
      })();
    }
  }, [config?.hideFeedbackButton, config?.surveyId]);

  if (config.hideFeedbackButton) return null;

  return (
    <>
      <button
        className="fixed right-0 top-1/2 -translate-y-[50%] bg-red-600 cursor-pointer z-[99999999] shadow-2xl px-1 py-3 rounded-ss-lg rounded-se-lg rounded-es-none rounded-ee-none rotate-180 text-white text-base flex items-center gap-1"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          ...style,
        }}
        onClick={() => handleOpenModal()}
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
        {state.isLoading ? 'Loading...' : config?.textButton}
      </button>
      <ModalSubmitted
        show={state.isSubmitted}
        onClose={() => setState({ ...state, isSubmitted: false })}
      />
    </>
  );
}

export default FeedbackButton;
