import React, { useState } from 'react';
import Modal from './Modal';
import { npsConfig } from '../utils';
import clsx from 'clsx';

interface Props {
  show: boolean;
  onClose: () => void;
}

function ModalFeedback({ show, onClose }: Props) {
  const [state, setState] = useState({
    selectedRating: null as null | number,
    comment: null as null | string,
    isLoading: false,
    isSuccess: false,
  });

  const handleSubmit = async () => {
    const config = npsConfig().get();
    setState({ ...state, isLoading: true });
    try {
      const response = await fetch(config.endpoint, {
        headers: { 'Content-Type': 'application/json' },
        method: config.endpointMethod,
        body: JSON.stringify({
          customer_id: config.customerId,
          survey_id: config.surveyId,
          score: state.selectedRating,
          comment: state.comment || '',
          response_date: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      if (Number(data?.statusCode) === 201) {
        setState({
          ...state,
          selectedRating: null,
          comment: null,
          isSuccess: true,
        });
        onClose();
      } else {
        alert('Terjadi kesalahan saat mengirimkan feedback.');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengirimkan feedback.');
    } finally {
      setState({ ...state, isLoading: false });
    }
  };
  return (
    <Modal show={show} onClose={() => onClose()}>
      <div className="w-[350px]">
        <img
          src={npsConfig().get().illustration}
          alt="Feedback"
          className="w-full rounded-xl h-auto"
          loading="lazy"
        />
        {state.isSuccess ? (
          <div className="grid place-content-center py-5 text-base text-center font-normal text-slate-800">
            {npsConfig().get().thankyou}
          </div>
        ) : (
          <div className="p-3">
            <h1 className="text-lg font-semibold text-black leading-6 my-3">
              {npsConfig().get().title}
            </h1>
            <div className="grid gap-1 grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <button
                  key={index}
                  className={clsx(
                    `w-full h-9 min-h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center outline-none border-none focus:outline-none`,
                    {
                      'bg-red-500 text-white':
                        state.selectedRating === index + 1 && state.selectedRating <= 3,
                      'bg-yellow-400 text-white':
                        state.selectedRating === index + 1 &&
                        state.selectedRating > 3 &&
                        state.selectedRating <= 7,
                      'bg-green-500 text-white':
                        state.selectedRating === index + 1 && state.selectedRating > 7,
                    }
                  )}
                  onClick={() => setState({ ...state, selectedRating: index + 1 })}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            {npsConfig().get().descriptionScore && (
              <p className="text-xs text-slate-500 my-2">{npsConfig().get().descriptionScore}</p>
            )}
            <textarea
              className="w-full h-24 border border-gray-300 rounded-lg px-3 py-2 mt-3 focus:outline-none focus:border-blue-500 placeholder:text-sm bg-white"
              placeholder="Masukkan komentar Anda"
              value={state.comment || ''}
              onChange={(e) => setState({ ...state, comment: e.target.value })}
            />
            <button
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
              onClick={handleSubmit}
              disabled={state.selectedRating === null || !state.comment || state.isLoading}
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
