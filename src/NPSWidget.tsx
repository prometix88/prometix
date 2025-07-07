import React, { useState } from 'react';

export interface NPSWidgetProps {
  question?: string;
}

export const NPSWidget: React.FC<NPSWidgetProps> = ({ question = 'Seberapa puas Anda?' }) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="p-4 border rounded shadow w-fit font-sans bg-white">
      <p className="mb-2 text-gray-700">{question}</p>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            className={`w-8 h-8 rounded-full text-sm border transition ${
              selected === i
                ? 'bg-blue-600 text-white border-blue-600'
                : 'hover:bg-blue-100 border-gray-300'
            }`}
            onClick={() => setSelected(i)}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
};
