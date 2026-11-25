"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { StudioLighting } from "./StudioLighting";

interface ArchitectureStack3DProps {
  activeLayer: number; // 0..3 synced to Act II Sticky Multi-Slide
}

/**
 * Act II 3D Model — "The Exploded 4-Layer Architecture Stack"
 * Visually tells the full-stack ownership story: Cloud Foundation -> App Engine ->
 * Luxury Design System -> Living Cinema & 3D. Highlights active slide layer.
 */
export function ArchitectureStack3D({ activeLayer }: ArchitectureStack3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const layerRefs = useRef<(THREE.Group | null)[]>([]);
  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);

  const layerConfigs = [
    { baseY: -1.15, color: "#0E171A", rim: "#00E5CC", glass: false }, // 01 Cloud Foundation
    { baseY: -0.38, color: "#ECEAE3", rim: "#00E5CC", glass: false }, // 02 Type-Safe Engine
    { baseY: 0.38, color: "#FFFFFF", rim: "#FF5A1F", glass: true }, // 03 Luxury Surface
    { baseY: 1.15, color: "#FAF8F4", rim: "#FF5A1F", glass: true }, // 04 Living Cinema
  ];

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        0.48 + state.pointer.x * 0.25 + Math.sin(t * 0.45) * 0.12,
        3.5,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        0.22 - state.pointer.y * 0.14,
        3.5,
        delta
      );
    }

    layerRefs.current.forEach((layer, idx) => {
      if (!layer) return;
      const isActive = idx === activeLayer;
      const offsetFromActive = idx - activeLayer;
      const targetY = layerConfigs[idx].baseY + offsetFromActive * 0.18 + (isActive ? Math.sin(t * 2) * 0.05 : 0);
      const targetScale = isActive ? 1.12 : 0.94;
      const targetX = isActive ? 0.22 : 0;

      layer.position.y = THREE.MathUtils.damp(layer.position.y, targetY, 5, delta);
      layer.position.x = THREE.MathUtils.damp(layer.position.x, targetX, 5, delta);
      const s = THREE.MathUtils.damp(layer.scale.x, targetScale, 5, delta);
      layer.scale.setScalar(s);
    });

    // Vertical neon data packets streaming cleanly between architecture layers
    packetRefs.current.forEach((pkt, i) => {
      if (!pkt) return;
      const speed = 0.7 + i * 0.18;
      const cycle = ((t * speed + i * 0.37) % 1) * 2.7 - 1.35;
      pkt.position.y = cycle;
    });
  });

  const accentMode = activeLayer >= 2 ? "orange" : "teal";

  return (
    <>
      <StudioLighting accent={accentMode} shadowY={-2.1} />

      <group ref={groupRef}>
        {layerConfigs.map((cfg, idx) => {
          const isActive = idx === activeLayer;
          return (
            <group
              key={idx}
              ref={(el) => {
                layerRefs.current[idx] = el;
              }}
              position={[0, cfg.baseY, 0]}
            >
              <RoundedBox args={[2.35, 0.22, 1.75]} radius={0.06} smoothness={4}>
                {cfg.glass ? (
                  <meshPhysicalMaterial
                    color={cfg.color}
                    transmission={isActive ? 0.72 : 0.45}
                    transparent
                    opacity={isActive ? 0.96 : 0.78}
                    roughness={0.14}
                    ior={1.45}
                    thickness={0.6}
                    clearcoat={1}
                  />
                ) : (
                  <meshPhysicalMaterial
                    color={cfg.color}
                    roughness={0.28}
                    metalness={idx === 0 ? 0.55 : 0.12}
                    clearcoat={0.7}
                  />
                )}
              </RoundedBox>

              {/* Precision Luminous Perimeter Trace */}
              <mesh position={[0, 0.118, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.42, 0.46, 48]} />
                <meshStandardMaterial
                  color={cfg.rim}
                  emissive={cfg.rim}
                  emissiveIntensity={isActive ? 2.5 : 0.55}
                  toneMapped={false}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Corner Micro-Studs */}
              {[
                [-0.95, 0.12, -0.68],
                [0.95, 0.12, -0.68],
                [-0.95, 0.12, 0.68],
                [0.95, 0.12, 0.68],
              ].map((pos, sIdx) => (
                <mesh key={sIdx} position={pos as [number, number, number]}>
                  <sphereGeometry args={[0.04, 12, 12]} />
                  <meshStandardMaterial
                    color={isActive ? cfg.rim : "#9DA8AC"}
                    emissive={isActive ? cfg.rim : "#000000"}
                    emissiveIntensity={isActive ? 2.2 : 0}
                    toneMapped={false}
                  />
                </mesh>
              ))}
            </group>
          );
        })}

        {/* Vertical Optical Conduits connecting all 4 layers */}
        {[
          [-0.78, 0, 0.55],
          [0.78, 0, -0.55],
        ].map((pos, cIdx) => (
          <mesh key={cIdx} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.012, 0.012, 2.8, 12]} />
            <meshStandardMaterial
              color={cIdx === 0 ? "#00E5CC" : "#FF5A1F"}
              emissive={cIdx === 0 ? "#00E5CC" : "#FF5A1F"}
              emissiveIntensity={1.2}
              transparent
              opacity={0.55}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Live Data Packets */}
        {[
          { x: -0.78, z: 0.55, color: "#00E5CC" },
          { x: -0.78, z: 0.55, color: "#00E5CC" },
          { x: 0.78, z: -0.55, color: "#FF5A1F" },
          { x: 0.78, z: -0.55, color: "#FF5A1F" },
        ].map((pkt, i) => (
          <mesh
            key={i}
            ref={(el) => {
              packetRefs.current[i] = el;
            }}
            position={[pkt.x, 0, pkt.z]}
          >
            <sphereGeometry args={[0.055, 14, 14]} />
            <meshStandardMaterial
              color={pkt.color}
              emissive={pkt.color}
              emissiveIntensity={2.6}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}
