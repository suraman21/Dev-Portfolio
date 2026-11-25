"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { StudioLighting } from "./StudioLighting";

interface HeroPrismEngineProps {
  exploded: boolean;
  onToggleExplode?: () => void;
}

/**
 * Act I Hero 3D Model — "The Prism Chronometer"
 * Horological brushed-titanium & matte porcelain rings orbiting a refractive
 * crystal prism containing Electric Neon Teal data conduits and an inner
 * Electric Neon Orange execution core. Click or toggle to explode layers.
 */
export function HeroPrismEngine({ exploded, onToggleExplode }: HeroPrismEngineProps) {
  const rootRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const topCapRef = useRef<THREE.Mesh>(null);
  const bottomCapRef = useRef<THREE.Mesh>(null);
  const orbitersRef = useRef<THREE.Group>(null);

  const orbitalNodes = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const angle = (i / 18) * Math.PI * 2;
      const radius = 1.95 + (i % 3) * 0.24;
      const y = ((i % 5) - 2) * 0.22;
      return {
        x: Math.cos(angle) * radius,
        y,
        z: Math.sin(angle) * radius,
        isOrange: i % 3 === 0,
        size: i % 3 === 0 ? 0.055 : 0.04,
      };
    });
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const damp = (curr: number, target: number, lambda = 4.5) =>
      THREE.MathUtils.damp(curr, target, lambda, delta);

    // Living ambient motion + gentle pointer parallax
    if (rootRef.current) {
      rootRef.current.rotation.y = damp(
        rootRef.current.rotation.y,
        state.pointer.x * 0.35 + t * 0.14,
        3.2
      );
      rootRef.current.rotation.x = damp(
        rootRef.current.rotation.x,
        -state.pointer.y * 0.22 + Math.sin(t * 0.6) * 0.06,
        3.2
      );
    }

    const spread = exploded ? 1 : 0;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.22;
      outerRingRef.current.rotation.x = Math.PI / 2.6 + Math.sin(t * 0.5) * 0.08;
      outerRingRef.current.position.y = damp(outerRingRef.current.position.y, spread * 0.62);
    }

    if (midRingRef.current) {
      midRingRef.current.rotation.y = -t * 0.38;
      midRingRef.current.rotation.x = Math.PI / 4;
      midRingRef.current.position.y = damp(midRingRef.current.position.y, -spread * 0.52);
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = t * 0.52;
      innerRingRef.current.rotation.z = t * 0.3;
      const s = damp(innerRingRef.current.scale.x, 1 + spread * 0.16);
      innerRingRef.current.scale.setScalar(s);
    }

    if (crystalRef.current) {
      crystalRef.current.rotation.y = -t * 0.32;
      crystalRef.current.rotation.z = Math.sin(t * 0.7) * 0.14;
      const sc = damp(crystalRef.current.scale.x, 1 + spread * 0.12);
      crystalRef.current.scale.setScalar(sc);
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.9;
      coreRef.current.rotation.x = t * 0.65;
      const pulse = 1 + Math.sin(t * 2.8) * 0.07 + spread * 0.18;
      coreRef.current.scale.setScalar(pulse);
    }

    if (topCapRef.current) {
      topCapRef.current.position.y = damp(topCapRef.current.position.y, 1.05 + spread * 0.72);
    }
    if (bottomCapRef.current) {
      bottomCapRef.current.position.y = damp(bottomCapRef.current.position.y, -1.05 - spread * 0.72);
    }
    if (orbitersRef.current) {
      orbitersRef.current.rotation.y = -t * 0.24;
      const os = damp(orbitersRef.current.scale.x, 1 + spread * 0.22);
      orbitersRef.current.scale.setScalar(os);
    }
  });

  return (
    <>
      <StudioLighting accent="balanced" shadowY={-2.05} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.55}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.45}
      />

      <Float speed={1.6} rotationIntensity={0.18} floatIntensity={0.28}>
        <group
          ref={rootRef}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExplode?.();
          }}
        >
          {/* Outer Matte Porcelain Architectural Gimbal Ring */}
          <mesh ref={outerRingRef}>
            <torusGeometry args={[1.68, 0.085, 28, 96]} />
            <meshPhysicalMaterial
              color="#F4F1EA"
              roughness={0.26}
              metalness={0.08}
              clearcoat={0.9}
              clearcoatRoughness={0.14}
            />
          </mesh>

          {/* Mid Brushed Satin Titanium Ring with Teal Edge */}
          <mesh ref={midRingRef}>
            <torusGeometry args={[1.32, 0.045, 24, 90]} />
            <meshPhysicalMaterial
              color="#C9D3D6"
              roughness={0.2}
              metalness={0.86}
              clearcoat={0.6}
            />
          </mesh>

          {/* Inner Electric Neon Teal Data Conduit Ring */}
          <mesh ref={innerRingRef}>
            <torusGeometry args={[0.98, 0.022, 18, 72]} />
            <meshStandardMaterial
              color="#00E5CC"
              emissive="#00E5CC"
              emissiveIntensity={2.1}
              toneMapped={false}
            />
          </mesh>

          {/* Refractive Dichroic Optical Glass Octahedron */}
          <mesh ref={crystalRef}>
            <octahedronGeometry args={[0.88, 0]} />
            <meshPhysicalMaterial
              color="#FFFFFF"
              transmission={0.88}
              opacity={1}
              transparent
              roughness={0.08}
              ior={1.52}
              thickness={1.4}
              iridescence={0.9}
              iridescenceIOR={1.35}
              clearcoat={1}
              clearcoatRoughness={0.06}
            />
          </mesh>

          {/* Inner Luminous Neon Orange Execution Core */}
          <mesh ref={coreRef}>
            <icosahedronGeometry args={[0.34, 1]} />
            <meshStandardMaterial
              color="#FF5A1F"
              emissive="#FF5A1F"
              emissiveIntensity={2.4}
              roughness={0.2}
              toneMapped={false}
            />
          </mesh>

          {/* Top & Bottom Precision Porcelain/Titanium Architecture Caps */}
          <mesh ref={topCapRef} position={[0, 1.05, 0]}>
            <cylinderGeometry args={[0.26, 0.36, 0.12, 32]} />
            <meshPhysicalMaterial
              color="#FAF8F3"
              roughness={0.22}
              metalness={0.18}
              clearcoat={0.8}
            />
          </mesh>
          <mesh ref={bottomCapRef} position={[0, -1.05, 0]}>
            <cylinderGeometry args={[0.36, 0.26, 0.12, 32]} />
            <meshPhysicalMaterial
              color="#0E171A"
              roughness={0.25}
              metalness={0.6}
              clearcoat={0.7}
            />
          </mesh>

          {/* Orbital Telemetry Particles (Neon Teal & Neon Orange) */}
          <group ref={orbitersRef}>
            {orbitalNodes.map((node, idx) => (
              <mesh key={idx} position={[node.x, node.y, node.z]}>
                <sphereGeometry args={[node.size, 14, 14]} />
                <meshStandardMaterial
                  color={node.isOrange ? "#FF5A1F" : "#00E5CC"}
                  emissive={node.isOrange ? "#FF5A1F" : "#00E5CC"}
                  emissiveIntensity={1.9}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
        </group>
      </Float>
    </>
  );
}
