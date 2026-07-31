'use client';

import { Html } from '@react-three/drei';

export default function Hotspot({ position, label, onClick, isActive }) {
  return (
    <Html position={position} distanceFactor={8}>
      <div
        onClick={onClick}
        className="relative flex items-center justify-center cursor-pointer"
      >
        {/* Pulsing ring animation */}
        <span className="absolute w-6 h-6 rounded-full bg-cyan-400/40 animate-ping" />
        {/* Main dot */}
        <span
          className={`relative w-4 h-4 rounded-full border-2 border-white shadow-lg transition-colors ${
            isActive ? 'bg-cyan-400' : 'bg-neutral-800'
          }`}
        />
      </div>
    </Html>
  );
}
