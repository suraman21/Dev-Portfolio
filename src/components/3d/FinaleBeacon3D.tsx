"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { StudioLighting } from "./StudioLighting";

interface FinaleBeacon3DProps {
  celebrating?: boolean;
}

/**
 * Act V & /contact Finale 3D Model — "The Quiet Horizon Beacon"
 * Serene porcelain monolith suspended over concentric ripples; radiates a warm
 * Neon Orange -> Teal pulse wave when the visitor sends a brief or books a call.
 */
export function FinaleBeacon3D({ celebrating = false }: FinaleBeacon3DProps) {
  const monolithRef = useRef<THREE.Group>(null);
  const ripple1Ref = useRef<THREE.Mesh>(null);
  const ripple2Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (monolithRef.current) {
      monolithRef.current.rotation.y = THREE.MathUtils.damp(
        monolithRef.current.rotation.y,
        t * (celebrating ? 0.8 : 0.18) + state.pointer.x * 0.3,
        3.2,
        delta
      );
    }

    if (ripple1Ref.current) {
      const s1 = 1 + ((t * (celebrating ? 0.9 : 0.35)) % 1) * 1.1;
      ripple1Ref.current.scale.setScalar(s1);
    }

    if (ripple2Ref.current) {
      const s2 = 1 + (((t * (celebrating ? 0.9 : 0.35)) + 0.5) % 1) * 1.1;
      ripple2Ref.current.scale.setScalar(s2);
    }

    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * (celebrating ? 6 : 2.2)) * 0.1;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <>
      <StudioLighting accent={celebrating ? "teal" : "orange"} shadowY={-1.55} />

      <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.24}>
        <group ref={monolithRef} position={[0, 0.25, 0]}>
          <RoundedBox args={[0.92, 1.82, 0.92]} radius={0.14} smoothness={5}>
            <meshPhysicalMaterial
              color="#FFFFFF"
              transmission={0.82}
              transparent
              roughness={0.1}
              ior={1.48}
              thickness={1.2}
              iridescence={0.85}
              clearcoat={1}
            />
          </RoundedBox>

          <mesh ref={coreRef}>
            <capsuleGeometry args={[0.18, 0.62, 16, 24]} />
            <meshStandardMaterial
              color={celebrating ? "#00E5CC" : "#FF5A1F"}
              emissive={celebrating ? "#00E5CC" : "#FF5A1F"}
              emissiveIntensity={celebrating ? 2.8 : 2.1}
              toneMapped={false}
            />
          </mesh>

          <mesh position={[0, -1.04, 0]}>
            <cylinderGeometry args={[0.68, 0.78, 0.14, 36]} />
            <meshPhysicalMaterial
              color="#0E171A"
              roughness={0.24}
              metalness={0.62}
              clearcoat={0.75}
            />
          </mesh>
        </group>
      </Float>

      {/* Concentric Sunlit Horizon Ripples */}
      <mesh ref={ripple1Ref} position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 0.89, 64]} />
        <meshStandardMaterial
          color="#00E5CC"
          emissive="#00E5CC"
          emissiveIntensity={1.6}
          transparent
          opacity={0.55}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={ripple2Ref} position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 0.89, 64]} />
        <meshStandardMaterial
          color="#FF5A1F"
          emissive="#FF5A1F"
          emissiveIntensity={1.5}
          transparent
          opacity={0.45}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
