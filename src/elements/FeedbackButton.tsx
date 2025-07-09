import React, { useState } from 'react';
import { npsConfig } from '../utils';
import clsx from 'clsx';
import ModalFeedback from './ModalFeedback';
import { useNpsContext } from '../hooks';

function FeedbackButton() {
  const [state, setState] = useState({
    showModal: false,
  });
  const { config } = useNpsContext();

  if (config.hideFeedbackButton) return null;
  return (
    <>
      <button
        className="fixed right-0 top-1/2 -translate-y-[50%] bg-red-600 cursor-pointer z-[99999999] shadow-2xl px-1 py-3 rounded-ss-lg rounded-se-lg rounded-es-none rounded-ee-none rotate-180 text-white text-base flex items-center gap-1"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
        }}
        onClick={() => setState({ ...state, showModal: true })}
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
        {npsConfig().get().textButton}
      </button>
      <ModalFeedback
        show={state.showModal}
        onClose={() => setState({ ...state, showModal: false })}
      />
    </>
  );
}

export default FeedbackButton;
