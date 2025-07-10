'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_SELECTOR } from '..';

type ModalProps = {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ show, onClose, children }: ModalProps) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleClose = () => {
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999999] flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-fit max-w-md p-3 transform transition-all duration-300 ${
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }, max-h-screen overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-2xl absolute top-2 right-4 text-slate-800"
          type="button"
          onClick={handleClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );

  if (!show) return null;
  if (!isBrowser) return null;

  return createPortal(modalContent, document.getElementById(DEFAULT_SELECTOR.replace('#', ''))!);
}
