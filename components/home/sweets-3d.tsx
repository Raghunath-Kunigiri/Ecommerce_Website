"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

function FloatOrStatic({
  enabled,
  position,
  children,
  speed = 1,
  rotationIntensity = 1,
  floatIntensity = 1,
}: {
  enabled: boolean;
  position: [number, number, number];
  children: ReactNode;
  speed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
}) {
  if (!enabled) return <group position={position}>{children}</group>;
  return (
    <Float
      speed={speed}
      rotationIntensity={rotationIntensity}
      floatIntensity={floatIntensity}
      position={position}
    >
      {children}
    </Float>
  );
}

function Laddu({ position }: { position: [number, number, number] }) {
  const color = "#d8944a";
  const reduced = useReducedMotion();
  return (
    <FloatOrStatic
      enabled={!reduced}
      position={position}
      speed={1.25}
      rotationIntensity={0.9}
      floatIntensity={0.8}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.52, 48, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0.24, 0.18, 0.28]} castShadow>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial color="#ffd666" roughness={0.4} />
      </mesh>
      <mesh position={[-0.18, -0.12, 0.34]} castShadow>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial color="#ff6a3d" roughness={0.45} />
      </mesh>
    </FloatOrStatic>
  );
}

function MithaiBox({ position }: { position: [number, number, number] }) {
  const reduced = useReducedMotion();
  return (
    <FloatOrStatic
      enabled={!reduced}
      position={position}
      speed={1}
      rotationIntensity={0.6}
      floatIntensity={0.55}
    >
      <group>
        <RoundedBox args={[1.6, 0.55, 1.2]} radius={0.14} smoothness={6} castShadow receiveShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.35} metalness={0.05} />
        </RoundedBox>
        <RoundedBox
          args={[1.62, 0.16, 1.22]}
          radius={0.14}
          smoothness={6}
          position={[0, 0.33, 0]}
          castShadow
        >
          <meshStandardMaterial color="#ff6a3d" roughness={0.45} metalness={0.05} />
        </RoundedBox>
        <mesh position={[0, 0.33, 0.62]} castShadow>
          <boxGeometry args={[1.4, 0.02, 0.02]} />
          <meshStandardMaterial color="#ffd666" roughness={0.35} />
        </mesh>
      </group>
    </FloatOrStatic>
  );
}

export function Sweets3D({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const dpr = useMemo(() => (typeof window !== "undefined" ? Math.min(1.75, window.devicePixelRatio) : 1), []);

  return (
    <div
      className={
        className ??
        "relative h-[360px] w-full overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur"
      }
    >
      <Canvas
        dpr={dpr}
        shadows
        camera={{ position: [0, 0.35, 4.25], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#000000"]} />

        <ambientLight intensity={0.35} />
        <directionalLight
          position={[4, 6, 2]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <group rotation={[0.12, -0.15, 0]}>
          <MithaiBox position={[0.1, -0.2, 0]} />
          <Laddu position={[-1.3, 0.1, 0.2]} />
          <Laddu position={[1.2, 0.25, -0.15]} />
        </group>

        <Environment resolution={256}>
          <Lightformer intensity={1.2} position={[0, 2.5, 2]} scale={[6, 2, 1]} />
          <Lightformer intensity={0.8} position={[-2.5, 0.8, -1]} scale={[4, 2, 1]} />
        </Environment>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,106,61,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25),transparent_45%,rgba(0,0,0,0.35))]" />
    </div>
  );
}

