"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { StudioLighting } from "./StudioLighting";

interface HeroWorkspace3DProps {
  layeredView: boolean;
  onToggleLayers?: () => void;
}

/**
 * Replacement Signature 3D Hero Model — "Precision Studio Workstation & Kinetic Core"
 * A sculpted porcelain-and-obsidian luxury laptop floating in sunlit gallery lighting,
 * paired with a hovering dual-axis Neon Teal + Neon Orange gyroscope core that
 * visualizes how interface design, APIs, and cloud architecture orbit as one machine.
 *
 * Tuned for crisp 24 FPS filmic motion cadence with lightweight PBR materials.
 */
export function HeroWorkspace3D({
  layeredView,
  onToggleLayers,
}: HeroWorkspace3DProps) {
  const rootRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const coreGroupRef = useRef<THREE.Group>(null);
  const gemRef = useRef<THREE.Mesh>(null);
  const tealRingRef = useRef<THREE.Mesh>(null);
  const orangeRingRef = useRef<THREE.Mesh>(null);
  const orbitNodesRef = useRef<THREE.Group>(null);
  const pulseBarRef = useRef<THREE.Mesh>(null);
  const [allowOrbitDrag, setAllowOrbitDrag] = useState(false);

  // Only enable OrbitControls drag on fine-pointer mouse/trackpad devices so mobile
  // vertical thumb swipes over the 3D Hero card NEVER get trapped by touch-action:none!
  useEffect(() => {
    setAllowOrbitDrag(window.matchMedia("(pointer: fine)").matches);
  }, []);

  // Precompute tactile low-profile keyboard key coordinates once
  const keys = useMemo(() => {
    const items: { x: number; z: number; w: number; color: string; glow?: boolean }[] = [];
    const rows = 4;
    const cols = 10;
    const startX = -0.86;
    const startZ = -0.34;
    const gapX = 0.19;
    const gapZ = 0.165;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Spacebar on bottom row middle
        if (r === 3 && c >= 3 && c <= 6) {
          if (c === 3) {
            items.push({
              x: startX + 4.5 * gapX,
              z: startZ + r * gapZ,
              w: 0.7,
              color: "#223036",
            });
          }
          continue;
        }
        const isEsc = r === 0 && c === 0;
        const isEnter = r === 1 && c === cols - 1;
        const isCmd = r === 3 && (c === 2 || c === 7);

        items.push({
          x: startX + c * gapX,
          z: startZ + r * gapZ,
          w: 0.145,
          color: isEsc ? "#FF5A1F" : isEnter || isCmd ? "#00E5CC" : "#223036",
          glow: isEsc || isEnter || isCmd,
        });
      }
    }
    return items;
  }, []);

  // Precompute clean illuminated code/telemetry lines on the studio screen
  const screenLines = useMemo(
    () => [
      { x: -0.62, y: 0.42, w: 0.56, color: "#00E5CC", glow: 1.7 },
      { x: -0.42, y: 0.28, w: 0.96, color: "#9CB4B9", glow: 0.25 },
      { x: -0.54, y: 0.14, w: 0.72, color: "#FF5A1F", glow: 1.8 },
      { x: -0.36, y: 0.0, w: 1.08, color: "#6F888E", glow: 0.2 },
      { x: -0.58, y: -0.14, w: 0.64, color: "#00E5CC", glow: 1.5 },
      { x: -0.48, y: -0.28, w: 0.84, color: "#52686E", glow: 0.15 },
    ],
    []
  );

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.08);
    const t = state.clock.elapsedTime;
    const damp = (curr: number, target: number, lambda = 7.5) =>
      THREE.MathUtils.damp(curr, target, lambda, delta);

    const expanded = layeredView ? 1 : 0;

    // Crisp, decisive 24fps float + responsive pointer tilt
    if (rootRef.current) {
      rootRef.current.position.y = damp(
        rootRef.current.position.y,
        -0.42 + Math.sin(t * 1.45) * 0.07,
        6
      );
      rootRef.current.rotation.y = damp(
        rootRef.current.rotation.y,
        -0.46 + state.pointer.x * 0.34 + Math.sin(t * 0.7) * 0.06,
        6.5
      );
      rootRef.current.rotation.x = damp(
        rootRef.current.rotation.x,
        0.24 - state.pointer.y * 0.18,
        6.5
      );
    }

    // Display lid opens slightly wider when inspecting the kinetic core
    if (lidRef.current) {
      lidRef.current.rotation.x = damp(lidRef.current.rotation.x, -0.34 - expanded * 0.22, 6.5);
    }

    // Hovering Holographic Gyro-Core rises & expands on toggle
    if (coreGroupRef.current) {
      coreGroupRef.current.position.y = damp(
        coreGroupRef.current.position.y,
        0.92 + expanded * 0.42 + Math.sin(t * 2.1) * 0.05,
        7
      );
      coreGroupRef.current.position.z = damp(
        coreGroupRef.current.position.z,
        0.18 + expanded * 0.25,
        7
      );
      const targetScale = 1 + expanded * 0.22;
      coreGroupRef.current.scale.setScalar(damp(coreGroupRef.current.scale.x, targetScale, 7));
    }

    // Decisive, real-speed 24fps orbital gyroscope motion
    if (gemRef.current) {
      gemRef.current.rotation.y = t * 1.15;
      gemRef.current.rotation.x = Math.sin(t * 0.9) * 0.35;
    }
    if (tealRingRef.current) {
      tealRingRef.current.rotation.z = t * 0.95;
      tealRingRef.current.rotation.x = 1.05 + expanded * 0.25 + Math.sin(t * 0.7) * 0.14;
    }
    if (orangeRingRef.current) {
      orangeRingRef.current.rotation.y = -t * 1.25;
      orangeRingRef.current.rotation.z = 0.65 - expanded * 0.3;
    }
    if (orbitNodesRef.current) {
      orbitNodesRef.current.rotation.y = t * 1.4;
      orbitNodesRef.current.rotation.z = 0.22;
    }
    if (pulseBarRef.current) {
      const pulse = 0.75 + Math.sin(t * 3.2) * 0.25;
      pulseBarRef.current.scale.x = pulse;
    }
  });

  return (
    <>
      <StudioLighting accent="balanced" shadowY={-1.55} />
      {allowOrbitDrag && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.65}
          minPolarAngle={Math.PI / 3.4}
          maxPolarAngle={Math.PI / 1.75}
          minAzimuthAngle={-Math.PI / 2.6}
          maxAzimuthAngle={Math.PI / 2.6}
        />
      )}

      <group
        ref={rootRef}
        position={[0, -0.42, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onToggleLayers?.();
        }}
      >
        {/* 1. SCULPTED PORCELAIN & BRUSHED TITANIUM WORKSTATION BASE */}
        <group position={[0, 0, 0.22]}>
          {/* Top Sunlit Porcelain Unibody Deck */}
          <RoundedBox args={[2.45, 0.11, 1.66]} radius={0.05} smoothness={4}>
            <meshPhysicalMaterial
              color="#FAF8F4"
              roughness={0.2}
              metalness={0.08}
              clearcoat={0.95}
              clearcoatRoughness={0.12}
            />
          </RoundedBox>

          {/* Underbody Obsidian Titanium Chamfer */}
          <RoundedBox args={[2.32, 0.055, 1.54]} radius={0.025} position={[0, -0.068, 0]}>
            <meshStandardMaterial color="#182328" roughness={0.34} metalness={0.72} />
          </RoundedBox>

          {/* Front Subtle Neon Teal Power LED Slit */}
          <mesh position={[0, 0.0, 0.835]}>
            <boxGeometry args={[0.38, 0.016, 0.01]} />
            <meshStandardMaterial
              color="#00E5CC"
              emissive="#00E5CC"
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>

          {/* Recessed Dark Keyboard Well */}
          <RoundedBox args={[2.02, 0.02, 0.78]} radius={0.02} position={[0, 0.052, -0.1]}>
            <meshStandardMaterial color="#111A1E" roughness={0.45} metalness={0.35} />
          </RoundedBox>

          {/* Tactile Keycap Matrix (Neon Orange ESC + Neon Teal Command/Enter) */}
          {keys.map((k, idx) => (
            <mesh key={idx} position={[k.x, 0.068, k.z]}>
              <boxGeometry args={[k.w, 0.022, 0.12]} />
              <meshStandardMaterial
                color={k.color}
                emissive={k.glow ? k.color : "#000000"}
                emissiveIntensity={k.glow ? 1.85 : 0}
                roughness={k.glow ? 0.25 : 0.42}
                toneMapped={!k.glow}
              />
            </mesh>
          ))}

          {/* Precision Trackpad with Hairline Border */}
          <RoundedBox args={[0.74, 0.012, 0.42]} radius={0.025} position={[0, 0.056, 0.54]}>
            <meshPhysicalMaterial
              color="#ECEAE3"
              roughness={0.16}
              metalness={0.05}
              clearcoat={0.85}
            />
          </RoundedBox>
        </group>

        {/* Precision Titanium Hinge Cylinder */}
        <mesh position={[0, 0.07, -0.6]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.042, 0.042, 1.88, 20]} />
          <meshStandardMaterial color="#1E2B31" roughness={0.28} metalness={0.8} />
        </mesh>

        {/* 2. ULTRA-SLIM HINGED STUDIO DISPLAY LID */}
        <group ref={lidRef} position={[0, 0.08, -0.6]} rotation={[-0.34, 0, 0]}>
          <group position={[0, 0.84, 0]}>
            {/* Porcelain Outer Lid Shell */}
            <RoundedBox args={[2.44, 1.62, 0.07]} radius={0.05} smoothness={4}>
              <meshPhysicalMaterial
                color="#FAF8F4"
                roughness={0.18}
                metalness={0.08}
                clearcoat={0.95}
              />
            </RoundedBox>

            {/* Deep Obsidian Glass Display Panel */}
            <RoundedBox args={[2.28, 1.46, 0.02]} radius={0.035} position={[0, 0, 0.034]}>
              <meshPhysicalMaterial
                color="#0B1418"
                roughness={0.12}
                metalness={0.25}
                clearcoat={1}
                clearcoatRoughness={0.08}
              />
            </RoundedBox>

            {/* Minimal Illuminated UI / Code Bars Inside Display */}
            {screenLines.map((line, idx) => (
              <mesh key={idx} position={[line.x, line.y, 0.05]}>
                <boxGeometry args={[line.w, 0.05, 0.008]} />
                <meshStandardMaterial
                  color={line.color}
                  emissive={line.color}
                  emissiveIntensity={line.glow}
                  toneMapped={false}
                />
              </mesh>
            ))}

            {/* Right-Side Live Signal Preview Card on Display */}
            <RoundedBox args={[0.76, 0.86, 0.012]} radius={0.04} position={[0.56, 0.05, 0.048]}>
              <meshStandardMaterial color="#132228" roughness={0.3} />
            </RoundedBox>
            <mesh ref={pulseBarRef} position={[0.56, 0.24, 0.058]}>
              <boxGeometry args={[0.52, 0.08, 0.008]} />
              <meshStandardMaterial
                color="#FF5A1F"
                emissive="#FF5A1F"
                emissiveIntensity={2.1}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0.56, -0.02, 0.058]}>
              <boxGeometry args={[0.52, 0.05, 0.008]} />
              <meshStandardMaterial
                color="#00E5CC"
                emissive="#00E5CC"
                emissiveIntensity={1.9}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0.45, -0.18, 0.058]}>
              <boxGeometry args={[0.3, 0.045, 0.008]} />
              <meshStandardMaterial color="#6D868C" roughness={0.4} />
            </mesh>

            {/* Top Bezel Neon Hairline Accent */}
            <mesh position={[0, 0.775, 0.04]}>
              <boxGeometry args={[0.58, 0.014, 0.008]} />
              <meshStandardMaterial
                color="#00E5CC"
                emissive="#00E5CC"
                emissiveIntensity={2.0}
                toneMapped={false}
              />
            </mesh>
          </group>
        </group>

        {/* 3. HOVERING HOLOGRAPHIC KINETIC GYRO-CORE (Floating Above Keyboard) */}
        <group ref={coreGroupRef} position={[0.16, 0.92, 0.18]}>
          {/* Central Faceted Porcelain & Chrome Core */}
          <mesh ref={gemRef}>
            <octahedronGeometry args={[0.32, 0]} />
            <meshPhysicalMaterial
              color="#FFFFFF"
              roughness={0.12}
              metalness={0.28}
              clearcoat={1}
              clearcoatRoughness={0.06}
            />
          </mesh>

          {/* Inner Luminous Orange Core Spark */}
          <mesh>
            <sphereGeometry args={[0.14, 20, 20]} />
            <meshStandardMaterial
              color="#FF5A1F"
              emissive="#FF5A1F"
              emissiveIntensity={2.4}
              toneMapped={false}
            />
          </mesh>

          {/* Outer Precision Electric Neon Teal Gyro Ring */}
          <mesh ref={tealRingRef} rotation={[1.05, 0.25, 0]}>
            <torusGeometry args={[0.66, 0.024, 16, 64]} />
            <meshStandardMaterial
              color="#00E5CC"
              emissive="#00E5CC"
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>

          {/* Inner Counter-Rotating Electric Neon Orange Gyro Ring */}
          <mesh ref={orangeRingRef} rotation={[0.45, 0, 0.65]}>
            <torusGeometry args={[0.5, 0.022, 16, 64]} />
            <meshStandardMaterial
              color="#FF5A1F"
              emissive="#FF5A1F"
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>

          {/* 3 Orbiting Modular Product Satellites (UI / API / Cloud) */}
          <group ref={orbitNodesRef}>
            {[
              { pos: [0.84, 0.08, 0] as [number, number, number], color: "#00E5CC" },
              { pos: [-0.42, 0.22, 0.72] as [number, number, number], color: "#FF5A1F" },
              { pos: [-0.42, -0.18, -0.72] as [number, number, number], color: "#0F171A" },
            ].map((node, i) => (
              <mesh key={i} position={node.pos}>
                <icosahedronGeometry args={[0.075, 0]} />
                <meshStandardMaterial
                  color={node.color}
                  emissive={i < 2 ? node.color : "#000000"}
                  emissiveIntensity={i < 2 ? 2.0 : 0}
                  roughness={0.22}
                  metalness={0.35}
                  toneMapped={i === 2}
                />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </>
  );
}
