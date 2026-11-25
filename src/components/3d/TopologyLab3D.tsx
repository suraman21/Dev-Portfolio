"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { StudioLighting } from "./StudioLighting";

interface TopologyLab3DProps {
  trafficRps: number; // 10..100
  edgeCache: boolean;
  refractionIor?: number; // 1.1..2.0
  exploded?: boolean;
}

/**
 * Act IV & /lab Interactive 3D Simulator
 * Directly responds to user controls (Flow & IKEA Effect):
 * - High RPS without Edge Cache pushes nodes into electric Neon Orange thermal load.
 * - Enabling Edge Cache restores serene Neon Teal equilibrium & smooth ring harmony.
 */
export function TopologyLab3D({
  trafficRps,
  edgeCache,
  refractionIor = 1.52,
  exploded = false,
}: TopologyLab3DProps) {
  const rootRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);

  const nodes = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / 24);
      const theta = Math.sqrt(24 * Math.PI) * phi;
      return {
        x: Math.cos(theta) * Math.sin(phi) * 1.48,
        y: Math.sin(theta) * Math.sin(phi) * 1.48,
        z: Math.cos(phi) * 1.48,
        phase: i * 0.45,
      };
    });
  }, []);

  const stressRatio = edgeCache ? trafficRps / 240 : trafficRps / 100;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const speed = 0.25 + stressRatio * 1.65;

    if (rootRef.current) {
      rootRef.current.rotation.y += delta * speed * 0.55;
      rootRef.current.rotation.x = THREE.MathUtils.damp(
        rootRef.current.rotation.x,
        -state.pointer.y * 0.28,
        3.5,
        delta
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * speed * 0.8;
      ringRef.current.rotation.x = Math.PI / 2.2 + Math.sin(t * 0.9) * 0.14;
    }

    const expand = exploded ? 1.32 : 1.0;
    nodeRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const n = nodes[idx];
      const jitter = !edgeCache && trafficRps > 65 ? Math.sin(t * 14 + n.phase) * 0.08 : Math.sin(t * 2 + n.phase) * 0.04;
      const r = expand + jitter;
      mesh.position.set(
        THREE.MathUtils.damp(mesh.position.x, n.x * r, 5, delta),
        THREE.MathUtils.damp(mesh.position.y, n.y * r, 5, delta),
        THREE.MathUtils.damp(mesh.position.z, n.z * r, 5, delta)
      );
    });
  });

  const isStressed = !edgeCache && trafficRps > 60;

  return (
    <>
      <StudioLighting accent={isStressed ? "orange" : "teal"} shadowY={-1.95} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.65} />

      <group ref={rootRef}>
        {/* Central Refractive Optical Core */}
        <mesh>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={0.86}
            transparent
            roughness={0.08}
            ior={refractionIor}
            thickness={1.4}
            iridescence={0.95}
            clearcoat={1}
          />
        </mesh>

        {/* Inner Core Reflects Real-Time Equilibrium vs Thermal Load */}
        <mesh>
          <sphereGeometry args={[0.36, 28, 28]} />
          <meshStandardMaterial
            color={isStressed ? "#FF5A1F" : "#00E5CC"}
            emissive={isStressed ? "#FF5A1F" : "#00E5CC"}
            emissiveIntensity={2.3 + stressRatio * 0.6}
            toneMapped={false}
          />
        </mesh>

        {/* Edge Caching Halo Ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[1.65, edgeCache ? 0.055 : 0.02, 20, 80]} />
          <meshStandardMaterial
            color={edgeCache ? "#00E5CC" : "#FF5A1F"}
            emissive={edgeCache ? "#00E5CC" : "#FF5A1F"}
            emissiveIntensity={edgeCache ? 2.1 : 1.4}
            toneMapped={false}
          />
        </mesh>

        {/* 24 Global Edge PoP Nodes */}
        {nodes.map((n, i) => {
          const hot = !edgeCache && i / 24 < trafficRps / 100;
          return (
            <mesh
              key={i}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              position={[n.x, n.y, n.z]}
            >
              <octahedronGeometry args={[hot ? 0.1 : 0.075, 0]} />
              <meshStandardMaterial
                color={hot ? "#FF5A1F" : i % 3 === 0 ? "#00E5CC" : "#EAE6DD"}
                emissive={hot ? "#FF5A1F" : i % 3 === 0 ? "#00E5CC" : "#000000"}
                emissiveIntensity={hot ? 2.5 : i % 3 === 0 ? 1.8 : 0}
                roughness={0.25}
                toneMapped={false}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}
