'use client';

export default function SpecPopover({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-80 bg-neutral-900/95 backdrop-blur-md border border-neutral-700 rounded-xl p-5 text-white shadow-2xl z-20">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-base">{data.title}</h3>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white text-lg leading-none"
        >
          ✕
        </button>
      </div>
      <p className="text-sm text-neutral-300 mb-3">{data.description}</p>
      <div className="space-y-1">
        {data.specs.map((spec) => (
          <div key={spec.label} className="flex justify-between text-xs">
            <span className="text-neutral-400">{spec.label}</span>
            <span className="text-neutral-100 font-medium">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}