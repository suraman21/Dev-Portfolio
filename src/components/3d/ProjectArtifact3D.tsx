"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { StudioLighting } from "./StudioLighting";
import type { ArtifactVariant } from "@/data/projects";

interface ProjectArtifact3DProps {
  variant: ArtifactVariant;
  interactive?: boolean;
}

/**
 * Bespoke Museum Pedestal 3D Sculptures for each flagship Case Study:
 * - prism: Aether Cloud OS (Global Edge Relay Prism)
 * - vault: Solstice Private Vault (Swiss Horological Multi-Sig Dial)
 * - monolith: Velour Spatial Atelier (Refractive Glass & Liquid Light Monolith)
 * - lattice: Kinetix Design Engine (Harmonic Kinetic Cube Lattice)
 */
export function ProjectArtifact3D({ variant, interactive = true }: ProjectArtifact3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const subRefA = useRef<THREE.Mesh>(null);
  const subRefB = useRef<THREE.Mesh>(null);
  const latticeRefs = useRef<(THREE.Mesh | null)[]>([]);

  const latticeCoords = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (Math.abs(x) + Math.abs(y) + Math.abs(z) <= 2) {
            pts.push([x * 0.62, y * 0.62, z * 0.62]);
          }
        }
      }
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        t * 0.25 + state.pointer.x * 0.4,
        3.2,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        -state.pointer.y * 0.2,
        3.2,
        delta
      );
    }

    if (subRefA.current) {
      subRefA.current.rotation.z = t * 0.45;
    }
    if (subRefB.current) {
      subRefB.current.rotation.z = -t * 0.65;
    }

    if (variant === "lattice") {
      latticeRefs.current.forEach((mesh, i) => {
        if (!mesh) return;
        const [bx, by, bz] = latticeCoords[i];
        const wave = Math.sin(t * 2.1 + (bx + by + bz) * 1.9) * 0.1;
        mesh.position.set(bx, by + wave, bz);
        mesh.rotation.y = t * 0.5 + i * 0.2;
      });
    }
  });

  const accent = variant === "vault" || variant === "lattice" ? "orange" : "teal";

  return (
    <>
      <StudioLighting accent={accent} shadowY={-1.65} />
      {interactive && <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} />}

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.22}>
        <group ref={groupRef}>
          {variant === "prism" && (
            <>
              <mesh>
                <dodecahedronGeometry args={[0.92, 0]} />
                <meshPhysicalMaterial
                  color="#FFFFFF"
                  transmission={0.85}
                  transparent
                  roughness={0.09}
                  ior={1.5}
                  thickness={1.2}
                  iridescence={0.85}
                  clearcoat={1}
                />
              </mesh>
              <mesh ref={subRefA} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[1.38, 0.032, 18, 72]} />
                <meshStandardMaterial
                  color="#00E5CC"
                  emissive="#00E5CC"
                  emissiveIntensity={2.2}
                  toneMapped={false}
                />
              </mesh>
              <mesh ref={subRefB} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
                <torusGeometry args={[1.15, 0.025, 16, 64]} />
                <meshStandardMaterial
                  color="#FF5A1F"
                  emissive="#FF5A1F"
                  emissiveIntensity={2.1}
                  toneMapped={false}
                />
              </mesh>
              <mesh>
                <octahedronGeometry args={[0.38, 0]} />
                <meshStandardMaterial
                  color="#00E5CC"
                  emissive="#00E5CC"
                  emissiveIntensity={2.0}
                  toneMapped={false}
                />
              </mesh>
            </>
          )}

          {variant === "vault" && (
            <>
              <mesh ref={subRefA}>
                <torusGeometry args={[1.25, 0.14, 28, 72]} />
                <meshPhysicalMaterial
                  color="#F5F2EB"
                  roughness={0.24}
                  metalness={0.14}
                  clearcoat={0.95}
                />
              </mesh>
              <mesh ref={subRefB}>
                <torusGeometry args={[0.88, 0.09, 24, 60]} />
                <meshPhysicalMaterial
                  color="#B8C4C8"
                  roughness={0.18}
                  metalness={0.9}
                  clearcoat={0.7}
                />
              </mesh>
              <mesh>
                <cylinderGeometry args={[0.56, 0.56, 0.26, 40]} />
                <meshPhysicalMaterial
                  color="#0E171A"
                  roughness={0.22}
                  metalness={0.68}
                  clearcoat={0.85}
                />
              </mesh>
              <mesh position={[0, 0, 0.15]}>
                <torusGeometry args={[0.36, 0.035, 16, 48]} />
                <meshStandardMaterial
                  color="#FF5A1F"
                  emissive="#FF5A1F"
                  emissiveIntensity={2.5}
                  toneMapped={false}
                />
              </mesh>
              <mesh position={[0, 0, -0.15]}>
                <torusGeometry args={[0.36, 0.03, 16, 48]} />
                <meshStandardMaterial
                  color="#00E5CC"
                  emissive="#00E5CC"
                  emissiveIntensity={2.0}
                  toneMapped={false}
                />
              </mesh>
            </>
          )}

          {variant === "monolith" && (
            <>
              <RoundedBox args={[1.15, 2.05, 0.52]} radius={0.12} smoothness={5}>
                <meshPhysicalMaterial
                  color="#FFFFFF"
                  transmission={0.9}
                  transparent
                  roughness={0.07}
                  ior={1.54}
                  thickness={1.5}
                  iridescence={1.0}
                  clearcoat={1}
                />
              </RoundedBox>
              <mesh ref={subRefA} position={[0, 0, 0]}>
                <torusKnotGeometry args={[0.38, 0.09, 96, 20]} />
                <meshStandardMaterial
                  color="#00E5CC"
                  emissive="#00E5CC"
                  emissiveIntensity={1.9}
                  roughness={0.2}
                  toneMapped={false}
                />
              </mesh>
              <mesh position={[0, -0.78, 0.3]}>
                <boxGeometry args={[0.72, 0.045, 0.045]} />
                <meshStandardMaterial
                  color="#FF5A1F"
                  emissive="#FF5A1F"
                  emissiveIntensity={2.4}
                  toneMapped={false}
                />
              </mesh>
            </>
          )}

          {variant === "lattice" && (
            <>
              {latticeCoords.map((pos, i) => {
                const isCenter = pos[0] === 0 && pos[1] === 0 && pos[2] === 0;
                const isOrange = i % 5 === 0;
                const isTeal = i % 4 === 1;
                return (
                  <mesh
                    key={i}
                    ref={(el) => {
                      latticeRefs.current[i] = el;
                    }}
                    position={pos}
                  >
                    <boxGeometry args={[0.34, 0.34, 0.34]} />
                    {isCenter || isOrange ? (
                      <meshStandardMaterial
                        color="#FF5A1F"
                        emissive="#FF5A1F"
                        emissiveIntensity={2.2}
                        toneMapped={false}
                      />
                    ) : isTeal ? (
                      <meshStandardMaterial
                        color="#00E5CC"
                        emissive="#00E5CC"
                        emissiveIntensity={1.85}
                        toneMapped={false}
                      />
                    ) : (
                      <meshPhysicalMaterial
                        color="#F8F6F1"
                        roughness={0.2}
                        metalness={0.14}
                        clearcoat={0.9}
                      />
                    )}
                  </mesh>
                );
              })}
            </>
          )}
        </group>
      </Float>
    </>
  );
}
