'use client';

import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { prometixConfig } from '../utils';
import clsx from 'clsx';

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  payload?: {
    surveyId: string;
    customerId: string;
    meta?: Record<string, any>;
  };
  optionsModal?: {
    title?: string;
    descriptionScore?: string;
    thankyou?: string;
    illustration?: string;
    followupQuestion?: string;
    survey_type?: string;
    color?: string;
  };
}

function ModalFeedback({ show, onClose, onSuccess, payload, optionsModal }: Props) {
  const [state, setState] = useState({
    selectedRating: 0,
    comment: null as null | string,
    isLoading: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    const config = prometixConfig().get();
    const meta = payload?.meta || config?.meta;
    setState({ ...state, isLoading: true });
    try {
      const response = await fetch(config?.api?.submit?.url, {
        headers: { 'Content-Type': 'application/json' },
        method: config?.api?.submit?.method,
        body: JSON.stringify({
          customer_id: payload?.customerId || config.customerId,
          survey_id: payload?.surveyId || config.surveyId,
          score: state.selectedRating,
          comment: state.comment || '',
          response_date: new Date().toISOString(),
          ...(meta ? { meta } : {}),
        }),
      });
      const data = await response.json();
      if (data.status) {
        setState({
          ...state,
          selectedRating: 0,
          comment: null,
        });
        setIsSuccess(true);
        onSuccess?.();
      } else {
        alert('Terjadi kesalahan saat mengirimkan feedback.');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengirimkan feedback.');
    } finally {
      setState({ ...state, isLoading: false });
    }
  };

  useEffect(() => {
    setIsSuccess(false);
    setState({
      selectedRating: 0,
      comment: null as null | string,
      isLoading: false,
    });
  }, [payload, optionsModal]);

  return (
    <Modal show={show} onClose={() => onClose()}>
      <div className="w-[350px]">
        <img
          src={optionsModal?.illustration || prometixConfig().get().illustration}
          alt="Feedback"
          className="w-full rounded-xl h-auto"
          loading="lazy"
        />
        {isSuccess ? (
          <div className="grid place-content-center py-5 text-base text-center font-normal text-slate-800">
            {optionsModal?.thankyou || prometixConfig().get().thankyou}
          </div>
        ) : (
          <div className="p-3">
            <h1 className="text-lg font-semibold text-black leading-6 my-3">
              {optionsModal?.title || prometixConfig().get().title}
            </h1>

            {optionsModal?.survey_type?.toUpperCase() === 'CSI' ? (
              <div className="flex justify-center gap-2 mt-6 mb-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1;
                  const isSelected = state.selectedRating >= value;
                  return (
                    <button
                      key={value}
                      className="transition-transform duration-200 hover:scale-110 focus:outline-none"
                      onClick={() => setState({ ...state, selectedRating: value })}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isSelected ? (optionsModal?.color || '#eab308') : 'none'}
                        stroke={isSelected ? (optionsModal?.color || '#eab308') : '#d1d5db'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-200"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={state.selectedRating}
                  onChange={(e) => setState({ ...state, selectedRating: Number(e.target.value) })}
                  className="w-full accent-blue-500 mt-2"
                  aria-label={optionsModal?.followupQuestion || prometixConfig().get().followupQuestion}
                />
                <div className="relative mt-1 h-4 select-none">
                  {Array.from({ length: 11 }).map((_, i) => {
                    const left = `${(i / 10) * 100}%`;
                    const transform = i === 0 ? undefined : i === 10 ? 'translateX(-100%)' : 'translateX(-50%)';
                    return (
                      <span
                        key={i}
                        className={clsx('absolute top-0 text-xs text-gray-500', {
                          'text-blue-600 font-semibold': state.selectedRating === i,
                        })}
                        style={{ left, transform }}
                      >
                        {i}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {(optionsModal?.descriptionScore || prometixConfig().get().descriptionScore) && (
              <p className="text-xs text-slate-500 my-2">
                {optionsModal?.descriptionScore || prometixConfig().get().descriptionScore}
              </p>
            )}
            <div className="mt-3">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor={optionsModal?.followupQuestion || prometixConfig().get().followupQuestion}
              >
                {optionsModal?.followupQuestion || prometixConfig().get().followupQuestion}
              </label>
              <textarea
                className="w-full h-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 placeholder:text-sm bg-white text-black mt-1"
                value={state.comment || ''}
                id={optionsModal?.followupQuestion || prometixConfig().get().followupQuestion}
                onChange={(e) => setState({ ...state, comment: e.target.value })}
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
              onClick={handleSubmit}
              disabled={!state.comment || state.isLoading}
            >
              {state.isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ModalFeedback;
