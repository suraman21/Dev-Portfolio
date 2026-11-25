"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { StudioLighting } from "./StudioLighting";

interface HeroWorkspace3DProps {
  layeredView: boolean;
  onToggleLayers?: () => void;
}

/**
 * Signature Interactive 3D Hero Centerpiece — "Layered SaaS Product Craft"
 * Tells a story any client or recruiter immediately understands:
 *   - Back Plate: Dark obsidian & titanium Cloud/API Foundation (Teal signals)
 *   - Main Frame: Matte porcelain SaaS Web Window with live 3D bar charts & Orange CTA
 *   - Front Floating Glass Cards: Tactile KPI & user-experience overlays
 * Drag to orbit or click to smoothly separate the layers.
 */
export function HeroWorkspace3D({
  layeredView,
  onToggleLayers,
}: HeroWorkspace3DProps) {
  const rootRef = useRef<THREE.Group>(null);
  const backLayerRef = useRef<THREE.Group>(null);
  const mainLayerRef = useRef<THREE.Group>(null);
  const frontCardLeftRef = useRef<THREE.Group>(null);
  const frontCardRightRef = useRef<THREE.Group>(null);
  const barRefs = useRef<(THREE.Mesh | null)[]>([]);

  const barHeights = [0.36, 0.54, 0.44, 0.72, 0.88];

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const damp = (curr: number, target: number, lambda = 4.6) =>
      THREE.MathUtils.damp(curr, target, lambda, delta);

    // Gentle living breathing + responsive mouse tilt
    if (rootRef.current) {
      rootRef.current.rotation.y = damp(
        rootRef.current.rotation.y,
        -0.22 + state.pointer.x * 0.28 + Math.sin(t * 0.55) * 0.05,
        3.5
      );
      rootRef.current.rotation.x = damp(
        rootRef.current.rotation.x,
        0.08 - state.pointer.y * 0.16,
        3.5
      );
    }

    const spread = layeredView ? 1 : 0;

    if (backLayerRef.current) {
      backLayerRef.current.position.z = damp(backLayerRef.current.position.z, -0.34 - spread * 0.65);
      backLayerRef.current.position.x = damp(backLayerRef.current.position.x, -0.14 - spread * 0.26);
    }

    if (mainLayerRef.current) {
      mainLayerRef.current.position.z = damp(mainLayerRef.current.position.z, 0);
    }

    if (frontCardLeftRef.current) {
      frontCardLeftRef.current.position.z = damp(
        frontCardLeftRef.current.position.z,
        0.44 + spread * 0.52
      );
      frontCardLeftRef.current.position.y = damp(
        frontCardLeftRef.current.position.y,
        -0.68 + Math.sin(t * 1.4) * 0.04
      );
    }

    if (frontCardRightRef.current) {
      frontCardRightRef.current.position.z = damp(
        frontCardRightRef.current.position.z,
        0.5 + spread * 0.62
      );
      frontCardRightRef.current.position.y = damp(
        frontCardRightRef.current.position.y,
        0.64 + Math.cos(t * 1.3) * 0.04
      );
    }

    // Subtle living motion on the 3D dashboard bars
    barRefs.current.forEach((bar, i) => {
      if (!bar) return;
      const base = barHeights[i];
      const wave = 1 + Math.sin(t * 2.1 + i * 0.85) * 0.08;
      bar.scale.y = wave;
      bar.position.y = -0.45 + (base * wave) / 2;
    });
  });

  return (
    <>
      <StudioLighting accent="balanced" shadowY={-1.75} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.65}
        minAzimuthAngle={-Math.PI / 3.2}
        maxAzimuthAngle={Math.PI / 3.2}
      />

      <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.18}>
        <group
          ref={rootRef}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLayers?.();
          }}
        >
          {/* LAYER 1 (BACK): Dark Obsidian Cloud & API Architecture Plate */}
          <group ref={backLayerRef} position={[-0.14, -0.05, -0.34]}>
            <RoundedBox args={[2.9, 1.95, 0.12]} radius={0.1} smoothness={4}>
              <meshPhysicalMaterial
                color="#0F1A1E"
                roughness={0.28}
                metalness={0.55}
                clearcoat={0.8}
              />
            </RoundedBox>
            {/* Glowing Teal Backend Service Strips */}
            {[-0.45, 0, 0.45].map((y, idx) => (
              <mesh key={idx} position={[-0.55, y, 0.075]}>
                <boxGeometry args={[1.25 - idx * 0.18, 0.07, 0.03]} />
                <meshStandardMaterial
                  color="#00E5CC"
                  emissive="#00E5CC"
                  emissiveIntensity={1.9}
                  toneMapped={false}
                />
              </mesh>
            ))}
            {/* Glowing Orange Edge Node */}
            <mesh position={[0.92, 0.45, 0.08]}>
              <sphereGeometry args={[0.1, 18, 18]} />
              <meshStandardMaterial
                color="#FF5A1F"
                emissive="#FF5A1F"
                emissiveIntensity={2.2}
                toneMapped={false}
              />
            </mesh>
          </group>

          {/* LAYER 2 (MAIN): Sunlit Porcelain SaaS Application Window */}
          <group ref={mainLayerRef} position={[0, 0, 0]}>
            {/* Main Porcelain Chassis */}
            <RoundedBox args={[3.1, 2.08, 0.12]} radius={0.12} smoothness={5}>
              <meshPhysicalMaterial
                color="#FAF8F4"
                roughness={0.22}
                metalness={0.06}
                clearcoat={0.95}
                clearcoatRoughness={0.12}
              />
            </RoundedBox>

            {/* Top Window Bar Divider */}
            <mesh position={[0, 0.72, 0.068]}>
              <boxGeometry args={[2.86, 0.015, 0.01]} />
              <meshStandardMaterial color="#DFDBD2" roughness={0.5} />
            </mesh>

            {/* Minimal Browser Window Dots */}
            {[
              { x: -1.32, color: "#FF5A1F" },
              { x: -1.16, color: "#00E5CC" },
              { x: -1.0, color: "#D4CFC5" },
            ].map((dot, idx) => (
              <mesh key={idx} position={[dot.x, 0.87, 0.072]}>
                <sphereGeometry args={[0.042, 16, 16]} />
                <meshStandardMaterial
                  color={dot.color}
                  emissive={idx < 2 ? dot.color : "#000000"}
                  emissiveIntensity={idx < 2 ? 1.5 : 0}
                  toneMapped={false}
                />
              </mesh>
            ))}

            {/* Left Sidebar Panel */}
            <RoundedBox args={[0.72, 1.4, 0.04]} radius={0.05} position={[-1.02, -0.12, 0.07]}>
              <meshPhysicalMaterial color="#F0EDE6" roughness={0.35} />
            </RoundedBox>
            {[0.32, 0.1, -0.12, -0.34].map((y, idx) => (
              <mesh key={idx} position={[-1.02, y, 0.098]}>
                <boxGeometry args={[0.46, 0.065, 0.02]} />
                <meshStandardMaterial
                  color={idx === 0 ? "#00E5CC" : "#C9C5BC"}
                  emissive={idx === 0 ? "#00E5CC" : "#000000"}
                  emissiveIntensity={idx === 0 ? 1.8 : 0}
                  toneMapped={false}
                />
              </mesh>
            ))}

            {/* Right Main Chart Stage */}
            <RoundedBox args={[1.95, 1.4, 0.04]} radius={0.06} position={[0.42, -0.12, 0.07]}>
              <meshPhysicalMaterial color="#FFFFFF" roughness={0.18} clearcoat={0.7} />
            </RoundedBox>

            {/* Sculpted Living 3D Analytics Bars */}
            {barHeights.map((h, i) => {
              const isPeak = i === barHeights.length - 1;
              return (
                <mesh
                  key={i}
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                  position={[-0.18 + i * 0.3, -0.45 + h / 2, 0.135]}
                >
                  <boxGeometry args={[0.17, h, 0.09]} />
                  <meshStandardMaterial
                    color={isPeak ? "#FF5A1F" : i >= 2 ? "#00E5CC" : "#D6DFDF"}
                    emissive={isPeak ? "#FF5A1F" : i >= 2 ? "#00E5CC" : "#000000"}
                    emissiveIntensity={isPeak ? 2.0 : i >= 2 ? 1.45 : 0}
                    roughness={0.25}
                    toneMapped={false}
                  />
                </mesh>
              );
            })}

            {/* Luminous Primary Action Pill (Top Right of Window) */}
            <RoundedBox args={[0.56, 0.16, 0.04]} radius={0.07} position={[1.12, 0.87, 0.075]}>
              <meshStandardMaterial
                color="#FF5A1F"
                emissive="#FF5A1F"
                emissiveIntensity={1.65}
                toneMapped={false}
              />
            </RoundedBox>
          </group>

          {/* LAYER 3A (FRONT LEFT): Floating Refractive Frosted Glass Metric Card */}
          <group ref={frontCardLeftRef} position={[-1.36, -0.68, 0.44]}>
            <RoundedBox args={[1.18, 0.64, 0.08]} radius={0.08} smoothness={4}>
              <meshPhysicalMaterial
                color="#FFFFFF"
                transmission={0.72}
                transparent
                opacity={0.95}
                roughness={0.14}
                ior={1.46}
                thickness={0.5}
                clearcoat={1}
              />
            </RoundedBox>
            <mesh position={[-0.36, 0.08, 0.055]}>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial
                color="#00E5CC"
                emissive="#00E5CC"
                emissiveIntensity={2.1}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0.14, 0.12, 0.055]}>
              <boxGeometry args={[0.58, 0.06, 0.02]} />
              <meshStandardMaterial color="#0F171A" roughness={0.3} />
            </mesh>
            <mesh position={[0.06, -0.06, 0.055]}>
              <boxGeometry args={[0.42, 0.045, 0.02]} />
              <meshStandardMaterial color="#8B989D" roughness={0.4} />
            </mesh>
          </group>

          {/* LAYER 3B (FRONT RIGHT): Floating Neon-Orange Accent Speed Pill */}
          <group ref={frontCardRightRef} position={[1.38, 0.64, 0.5]}>
            <RoundedBox args={[1.08, 0.56, 0.08]} radius={0.08} smoothness={4}>
              <meshPhysicalMaterial
                color="#FFFFFF"
                transmission={0.72}
                transparent
                opacity={0.95}
                roughness={0.14}
                ior={1.46}
                thickness={0.5}
                clearcoat={1}
              />
            </RoundedBox>
            <mesh position={[0, 0.07, 0.055]}>
              <boxGeometry args={[0.68, 0.08, 0.025]} />
              <meshStandardMaterial
                color="#FF5A1F"
                emissive="#FF5A1F"
                emissiveIntensity={1.9}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[-0.1, -0.1, 0.055]}>
              <boxGeometry args={[0.46, 0.045, 0.02]} />
              <meshStandardMaterial color="#59686E" roughness={0.4} />
            </mesh>
          </group>
        </group>
      </Float>
    </>
  );
}
