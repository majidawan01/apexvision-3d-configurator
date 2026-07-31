'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useConfiguratorStore } from '@/store/configuratorStore';
import Hotspot from './Hotspot';
import SpecPopover from '../common/SpecPopover';
import LoadingScreen from '../common/LoadingScreen';

const hotspotData = [
  {
    id: 'visor',
    position: [0.3, 0.5, 0.9],
    title: 'Reinforced Visor',
    description: 'Impact-resistant polycarbonate visor with anti-fog coating.',
    specs: [
      { label: 'Material', value: 'Polycarbonate' },
      { label: 'Tint', value: 'Cyan Reflective' },
    ],
  },
  {
    id: 'comm',
    position: [0.9, 0.1, 0.2],
    title: 'Comm Unit',
    description: 'Integrated short-range communication transceiver.',
    specs: [
      { label: 'Range', value: '5 km' },
      { label: 'Battery', value: '12 hrs' },
    ],
  },
  {
    id: 'valve',
    position: [0, -0.6, 0.5],
    title: 'Oxygen Valve',
    description: 'Emergency air regulation valve with pressure indicator.',
    specs: [
      { label: 'Pressure', value: '200 bar' },
      { label: 'Type', value: 'Fail-safe' },
    ],
  },
];

const productConfig = {
  helmet: { label: 'Tactical Helmet', file: '/models/DamagedHelmet.glb' },
  gearbox: { label: 'Gearbox Assembly', file: '/models/GearboxAssy.glb' },
  adventurer: { label: 'Adventurer', file: '/models/Adventurer.glb' },
  mancharacter: { label: 'Man Character', file: '/models/ManCharacter.glb' },
};

// Har GenericModel isi fixed size mein normalize hoga — is se camera distance bhi fix rakh sakte hain
const GENERIC_TARGET_SIZE = 3;
// Formula se calculate kiya camera distance (guess nahi) — target size ke 2.4x door se poora object frame mein aata hai
const GENERIC_CAMERA_DISTANCE = GENERIC_TARGET_SIZE * 2.4;

function HelmetModel() {
  const { scene } = useGLTF('/models/DamagedHelmet.glb');
  const setModelLoading = useConfiguratorStore((state) => state.setModelLoading);
  const color = useConfiguratorStore((state) => state.color);
  const roughness = useConfiguratorStore((state) => state.roughness);
  const metalness = useConfiguratorStore((state) => state.metalness);

  useEffect(() => {
    setModelLoading(false);
  }, [setModelLoading]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(color);
        child.material.roughness = roughness;
        child.material.metalness = metalness;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, color, roughness, metalness]);

  return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />;
}

function GearboxModel() {
  const { scene } = useGLTF('/models/GearboxAssy.glb');
  const setModelLoading = useConfiguratorStore((state) => state.setModelLoading);
  const isExploded = useConfiguratorStore((state) => state.isExploded);
  const color = useConfiguratorStore((state) => state.color);
  const roughness = useConfiguratorStore((state) => state.roughness);
  const metalness = useConfiguratorStore((state) => state.metalness);
  const groupRef = useRef();

  useEffect(() => {
    setModelLoading(false);

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 4;
    const scaleFactor = targetSize / maxDim;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleFactor);
      groupRef.current.position.set(
        -center.x * scaleFactor,
        -center.y * scaleFactor,
        -center.z * scaleFactor
      );
    }
  }, [scene, setModelLoading]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && !child.userData.basePosition) {
        child.userData.basePosition = child.position.clone();
      }
    });
  }, [scene]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(color);
        child.material.roughness = roughness;
        child.material.metalness = metalness;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, color, roughness, metalness]);

  useFrame(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.userData.basePosition) {
        const base = child.userData.basePosition;
        const target = isExploded ? base.clone().multiplyScalar(1.8) : base;
        child.position.lerp(target, 0.08);
      }
    });
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Generic component — kisi bhi character/model ko FIXED target size mein normalize karta hai
function GenericModel({ filePath }) {
  const { scene } = useGLTF(filePath);
  const setModelLoading = useConfiguratorStore((state) => state.setModelLoading);
  const color = useConfiguratorStore((state) => state.color);
  const roughness = useConfiguratorStore((state) => state.roughness);
  const metalness = useConfiguratorStore((state) => state.metalness);
  const groupRef = useRef();

  useEffect(() => {
    setModelLoading(false);

    // Sirf ACTUAL mesh geometry se bounding box banao — bones/armature ko ignore karo
    const box = new THREE.Box3();
    let hasMesh = false;

    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        child.updateWorldMatrix(true, false);
        const meshBox = new THREE.Box3().setFromBufferAttribute(
          child.geometry.attributes.position
        );
        meshBox.applyMatrix4(child.matrixWorld);
        box.union(meshBox);
        hasMesh = true;
      }
    });

    if (!hasMesh) return;

    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = GENERIC_TARGET_SIZE / maxDim;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleFactor);
      groupRef.current.position.set(
        -center.x * scaleFactor,
        -box.min.y * scaleFactor,
        -center.z * scaleFactor
      );
    }
  }, [scene, setModelLoading]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(color);
        child.material.roughness = roughness;
        child.material.metalness = metalness;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, color, roughness, metalness]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function SnapshotHandler() {
  const { gl, scene, camera } = useThree();
  const snapshotRequested = useConfiguratorStore((state) => state.snapshotRequested);
  const clearSnapshotRequest = useConfiguratorStore((state) => state.clearSnapshotRequest);

  useFrame(() => {
    if (snapshotRequested) {
      gl.render(scene, camera);
      const dataURL = gl.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `apexvision-config-${Date.now()}.png`;
      link.click();
      clearSnapshotRequest();
    }
  });

  return null;
}

function CameraRig({ activeHotspot, controlsRef, activeProduct }) {
  const { camera } = useThree();
  let defaultPosition;
  let defaultTarget;

  if (activeProduct === 'gearbox') {
    defaultPosition = new THREE.Vector3(0, 3, 10);
    defaultTarget = new THREE.Vector3(0, 0, 0);
  } else if (activeProduct === 'helmet') {
    defaultPosition = new THREE.Vector3(3, 2, 5);
    defaultTarget = new THREE.Vector3(0, 0, 0);
  } else {
    // Generic models (adventurer, mancharacter) — formula-based distance, guess nahi
    defaultPosition = new THREE.Vector3(0, GENERIC_TARGET_SIZE * 0.55, GENERIC_CAMERA_DISTANCE);
    defaultTarget = new THREE.Vector3(0, GENERIC_TARGET_SIZE * 0.4, 0);
  }

  useFrame(() => {
    let targetPos = defaultPosition;
    let lookAt = defaultTarget;

    if (activeHotspot) {
      const hp = activeHotspot.position;
      targetPos = new THREE.Vector3(hp[0] * 2.2, hp[1] * 2.2 + 0.3, hp[2] * 2.2);
      lookAt = new THREE.Vector3(hp[0], hp[1], hp[2]);
    }

    camera.position.lerp(targetPos, 0.06);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookAt, 0.06);
      controlsRef.current.update();
    }
  });

  return null;
}

function ProductNav() {
  const activeProduct = useConfiguratorStore((state) => state.activeProduct);
  const nextProduct = useConfiguratorStore((state) => state.nextProduct);
  const prevProduct = useConfiguratorStore((state) => state.prevProduct);

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
      <button
        onClick={prevProduct}
        className="w-10 h-10 rounded-full bg-neutral-800/80 border border-neutral-600 text-white flex items-center justify-center hover:bg-neutral-700 transition-all"
      >
        ←
      </button>
      <span className="text-white text-sm font-medium tracking-wide capitalize min-w-[140px] text-center">
        {productConfig[activeProduct]?.label}
      </span>
      <button
        onClick={nextProduct}
        className="w-10 h-10 rounded-full bg-neutral-800/80 border border-neutral-600 text-white flex items-center justify-center hover:bg-neutral-700 transition-all"
      >
        →
      </button>
    </div>
  );
}

export default function Scene() {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const controlsRef = useRef();
  const activeProduct = useConfiguratorStore((state) => state.activeProduct);
  const sceneMode = useConfiguratorStore((state) => state.sceneMode);

  const handleHotspotClick = (hotspot) => {
    setActiveHotspot(hotspot.id === activeHotspot?.id ? null : hotspot);
  };

  const renderModel = () => {
    if (activeProduct === 'helmet') return <HelmetModel />;
    if (activeProduct === 'gearbox') return <GearboxModel />;
    return <GenericModel filePath={productConfig[activeProduct].file} />;
  };

  return (
    <div className="w-full h-screen bg-neutral-900">
      <LoadingScreen />
      <Canvas
        shadows
        camera={{ position: [3, 2, 5], fov: 45 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          {sceneMode === 'space' ? (
            <>
              <color attach="background" args={['#02020a']} />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </>
          ) : (
            <color attach="background" args={['#bfe3f7']} />
          )}
          <ambientLight intensity={sceneMode === 'space' ? 0.4 : 0.8} />

          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {renderModel()}
          <SnapshotHandler />

          {activeProduct === 'helmet' &&
            hotspotData.map((hotspot) => (
              <Hotspot
                key={hotspot.id}
                position={hotspot.position}
                isActive={activeHotspot?.id === hotspot.id}
                onClick={() => handleHotspotClick(hotspot)}
              />
            ))}

          <ContactShadows position={[0, -0.02, 0]} opacity={0.5} scale={10} blur={2} />

          <CameraRig
            activeHotspot={activeProduct === 'helmet' ? activeHotspot : null}
            controlsRef={controlsRef}
            activeProduct={activeProduct}
          />

          <Environment preset={sceneMode === 'space' ? 'night' : 'sunset'} background={false} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={1}
          maxDistance={30}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      </Canvas>

      <SpecPopover data={activeHotspot} onClose={() => setActiveHotspot(null)} />
      <ProductNav />
    </div>
  );
}

useGLTF.preload('/models/DamagedHelmet.glb');
useGLTF.preload('/models/GearboxAssy.glb');
useGLTF.preload('/models/Adventurer.glb');
useGLTF.preload('/models/ManCharacter.glb');