'use client';

import React from 'react';
import Modal from './Modal';
import { feedbackConfig } from '../utils';

interface Props {
  show: boolean;
  onClose: () => void;
}

function ModalSubmitted({ show, onClose }: Props) {
  return (
    <Modal show={show} onClose={() => onClose()}>
      <div className="w-[350px]">
        <img
          src={feedbackConfig().get().illustration}
          alt="Feedback"
          className="w-full rounded-xl h-auto"
          loading="lazy"
        />
        <div className="grid place-content-center py-5 text-base text-center font-normal text-slate-800">
          {feedbackConfig().get().textSubmitted}
        </div>
      </div>
    </Modal>
  );
}

export default ModalSubmitted;
