'use client';

import { useConfiguratorStore } from '@/store/configuratorStore';
import { useState } from 'react';

// Pre-set aesthetic themes (SRS section 2.2)
const presets = [
  {
    name: 'Matte Midnight',
    color: '#1a1a1a',
    roughness: 0.7,
    metalness: 0.2,
    swatch: '#1a1a1a',
  },
  {
    name: 'Cyberpunk Neon',
    color: '#39ff14',
    roughness: 0.2,
    metalness: 0.8,
    swatch: '#39ff14',
  },
  {
    name: 'Brushed Titanium',
    color: '#8a8d90',
    roughness: 0.3,
    metalness: 0.9,
    swatch: '#8a8d90',
  },
  {
    name: 'Rose Gold Luxury',
    color: '#b76e79',
    roughness: 0.15,
    metalness: 0.95,
    swatch: '#b76e79',
  },
];

export default function Sidebar() {

const currentPreset = useConfiguratorStore((state) => state.currentPreset);
  const sceneMode = useConfiguratorStore((state) => state.sceneMode);
  const toggleSceneMode = useConfiguratorStore((state) => state.toggleSceneMode);
  const setPreset = useConfiguratorStore((state) => state.setPreset);
  const isExploded = useConfiguratorStore((state) => state.isExploded);
  const toggleExplode = useConfiguratorStore((state) => state.toggleExplode);
  const requestSnapshot = useConfiguratorStore((state) => state.requestSnapshot);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('preset', currentPreset);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-0 right-0 h-screen w-72 bg-neutral-900/90 backdrop-blur-md text-white p-6 flex flex-col gap-6 border-l border-neutral-700 z-10 overflow-y-auto">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          ApexVision Configurator
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Customize your product in real-time
        </p>
      </div>

      {/* Preset Themes */}
      <div>
        <h3 className="text-sm font-medium text-neutral-300 mb-3">
          Material Presets
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() =>
                setPreset(preset.name, {
                  color: preset.color,
                  roughness: preset.roughness,
                  metalness: preset.metalness,
                })
              }
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                currentPreset === preset.name
                  ? 'border-white bg-neutral-800'
                  : 'border-neutral-700 hover:border-neutral-500'
              }`}
            >
              <span
                className="w-8 h-8 rounded-full border border-neutral-600"
                style={{ backgroundColor: preset.swatch }}
              />
              <span className="text-xs text-center leading-tight">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Exploded View Toggle */}
      <div>
        <h3 className="text-sm font-medium text-neutral-300 mb-3">
          View Mode
        </h3>
        <button
          onClick={toggleExplode}
          className={`w-full py-2 rounded-lg border text-sm transition-all ${
            isExploded
              ? 'border-white bg-neutral-800'
              : 'border-neutral-700 hover:border-neutral-500'
          }`}
        >
          {isExploded ? 'Collapse View' : 'Exploded View'}
        </button>
      </div>
      {/* Snapshot Export */}
      <div>
        <h3 className="text-sm font-medium text-neutral-300 mb-3">
          Export
        </h3>
        <button
          onClick={requestSnapshot}
          className="w-full py-2 rounded-lg border border-neutral-700 hover:border-neutral-500 text-sm transition-all flex items-center justify-center gap-2"
        >
          📸 Download Snapshot
        </button>
      </div>
      {/* Share Link */}
      <div>
        <h3 className="text-sm font-medium text-neutral-300 mb-3">
          Share
        </h3>
        <button
          onClick={handleShare}
          className="w-full py-2 rounded-lg border border-neutral-700 hover:border-neutral-500 text-sm transition-all flex items-center justify-center gap-2"
        >
          {copied ? '✅ Link Copied!' : '🔗 Copy Share Link'}
        </button>
      </div>
      {/* Scene Environment */}
      <div>
        <h3 className="text-sm font-medium text-neutral-300 mb-3">
          Environment
        </h3>
        <button
          onClick={toggleSceneMode}
          className="w-full py-2 rounded-lg border border-neutral-700 hover:border-neutral-500 text-sm transition-all flex items-center justify-center gap-2"
        >
          {sceneMode === 'day' ? '🌌 Switch to Space' : '☀️ Switch to Day'}
        </button>
      </div>
    </div>
  );
}