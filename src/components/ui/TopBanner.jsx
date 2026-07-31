'use client';

export default function TopBanner() {
  return (
    <div className="fixed top-0 left-0 z-10 p-6">
      <h1 className="text-white text-xl font-bold tracking-tight">
        ApexVision<span className="text-cyan-400">3D</span>
      </h1>
      <p className="text-neutral-400 text-xs mt-1">
        Tactical Helmet — Interactive Configurator
      </p>
    </div>
  );
}