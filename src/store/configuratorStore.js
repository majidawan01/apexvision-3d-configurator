import { create } from 'zustand';

export const useConfiguratorStore = create((set) => ({
  // Currently selected color/material theme
  currentPreset: 'Matte Midnight',

  // Individual material properties
  color: '#1a1a1a',
  roughness: 0.4,
  metalness: 0.6,

  // Exploded view toggle (true = parts separated)
  isExploded: false,

  // Currently focused component (for camera transitions)
  focusedPart: null,

  // Loading state for the 3D model
  isModelLoading: true,

  // Actions (functions to update the state above)
  setPreset: (presetName, presetValues) =>
    set({
      currentPreset: presetName,
      ...presetValues,
    }),

  setColor: (newColor) => set({ color: newColor }),

  toggleExplode: () =>
    set((state) => ({ isExploded: !state.isExploded })),

  setFocusedPart: (partName) => set({ focusedPart: partName }),

  setModelLoading: (status) => set({ isModelLoading: status }),

  // Snapshot trigger
  snapshotRequested: false,
  requestSnapshot: () => set({ snapshotRequested: true }),
  clearSnapshotRequest: () => set({ snapshotRequested: false }),

  // Product switcher — products list mein se cycle karta hai
  productList: ['helmet', 'gearbox', 'adventurer', 'mancharacter'],
  activeProduct: 'helmet',
  nextProduct: () =>
    set((state) => {
      const idx = state.productList.indexOf(state.activeProduct);
      const nextIdx = (idx + 1) % state.productList.length;
      return { activeProduct: state.productList[nextIdx] };
    }),
  prevProduct: () =>
    set((state) => {
      const idx = state.productList.indexOf(state.activeProduct);
      const prevIdx = (idx - 1 + state.productList.length) % state.productList.length;
      return { activeProduct: state.productList[prevIdx] };
    }),

  // Scene background mode
  sceneMode: 'day',
  toggleSceneMode: () =>
    set((state) => ({
      sceneMode: state.sceneMode === 'day' ? 'space' : 'day',
    })),
}));