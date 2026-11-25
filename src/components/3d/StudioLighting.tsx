"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

interface StudioLightingProps {
  accent?: "balanced" | "teal" | "orange";
  shadowY?: number;
  showShadows?: boolean;
}

/**
 * Sunlit Architectural PBR Lighting Studio for Bright Light Mode.
 * Combines warm alabaster key softboxes with crisp Electric Neon Teal &
 * Electric Neon Orange Lightformers and short-range bounce lights so white
 * porcelain ceramic picks up luminous neon reflections without washout.
 */
export function StudioLighting({
  accent = "balanced",
  shadowY = -1.85,
  showShadows = true,
}: StudioLightingProps) {
  const tealBoost = accent === "teal" ? 1.45 : accent === "orange" ? 0.75 : 1.1;
  const orangeBoost = accent === "orange" ? 1.45 : accent === "teal" ? 0.75 : 1.1;

  return (
    <>
      <ambientLight intensity={0.78} color="#FAF8F3" />
      <directionalLight position={[5, 7, 6]} intensity={1.7} color="#FFFBF4" />
      <directionalLight position={[-6, 3, -3]} intensity={0.75} color="#DFFAF6" />

      {/* Real colored neon bounce lights illuminating matte porcelain surfaces */}
      <pointLight
        position={[-3.2, 1.4, 2.4]}
        intensity={4.2 * tealBoost}
        distance={9}
        decay={2}
        color="#00E5CC"
      />
      <pointLight
        position={[3.2, -0.8, 2.6]}
        intensity={4.0 * orangeBoost}
        distance={9}
        decay={2}
        color="#FF5A1F"
      />

      {/* Lightweight procedural HDRI Studio Softboxes (0KB external HDR download) */}
      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 0.25]}>
          {/* Overhead warm porcelain gallery softbox */}
          <Lightformer
            form="rect"
            intensity={2.4}
            color="#FFFDF8"
            position={[0, 5, 1]}
            scale={[10, 4, 1]}
          />
          {/* Electric Neon Teal left optical rim strip */}
          <Lightformer
            form="rect"
            intensity={3.6 * tealBoost}
            color="#00E5CC"
            position={[-5, 1, 2]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[6, 1.8, 1]}
          />
          {/* Electric Neon Orange right specular strip */}
          <Lightformer
            form="rect"
            intensity={3.6 * orangeBoost}
            color="#FF5A1F"
            position={[5, -0.5, 2]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[6, 1.8, 1]}
          />
          {/* Subtle alabaster floor bounce */}
          <Lightformer
            form="ring"
            intensity={1.1}
            color="#F7F5F0"
            position={[0, -5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={8}
          />
        </group>
      </Environment>

      {showShadows && (
        <ContactShadows
          position={[0, shadowY, 0]}
          opacity={0.28}
          scale={9}
          blur={2.4}
          far={4.5}
          color="#163036"
        />
      )}
    </>
  );
}
