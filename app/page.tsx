'use client';

import { useEffect } from 'react';
import Scene from '@/components/canvas/Scene';
import Sidebar from '@/components/ui/Sidebar';
import TopBanner from '@/components/ui/TopBanner';
import { useConfiguratorStore } from '@/store/configuratorStore';

const presetMap: Record<string, { color: string; roughness: number; metalness: number }> = {
  'Matte Midnight': { color: '#1a1a1a', roughness: 0.7, metalness: 0.2 },
  'Cyberpunk Neon': { color: '#39ff14', roughness: 0.2, metalness: 0.8 },
  'Brushed Titanium': { color: '#8a8d90', roughness: 0.3, metalness: 0.9 },
  'Rose Gold Luxury': { color: '#b76e79', roughness: 0.15, metalness: 0.95 },
};

export default function Home() {
  const setPreset = useConfiguratorStore((state) => state.setPreset);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetName = params.get('preset');
    if (presetName && presetMap[presetName]) {
      setPreset(presetName, presetMap[presetName]);
    }
  }, [setPreset]);

  return (
    <main>
      <Scene />
      <Sidebar />
      <TopBanner />
    </main>
  );
}