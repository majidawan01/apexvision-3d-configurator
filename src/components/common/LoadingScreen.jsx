'use client';

import { useProgress } from '@react-three/drei';

export default function LoadingScreen() {
  const { progress, active } = useProgress();

  if (!active) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900 flex flex-col items-center justify-center z-50 transition-opacity duration-500">
      <div className="w-16 h-16 border-4 border-neutral-700 border-t-cyan-400 rounded-full animate-spin mb-6" />
      <p className="text-white text-sm font-medium tracking-wide mb-2">
        Loading 3D Model
      </p>
      <div className="w-64 h-1 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-neutral-500 text-xs mt-2">{Math.round(progress)}%</p>
    </div>
  );
}