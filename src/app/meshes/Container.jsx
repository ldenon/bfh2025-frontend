import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";

export default function Container({
  length = 5.89,
  width = 2.35,
  height = 2.3,
  thickness = 0.3,
  color = "#7c7c7c",
  position,
  children,
}) {
  const geometry = useRef();
  const material = useRef();
  const containerMesh = useRef();

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    // containerMesh.current.position.x = a;
  });

  return (
    <group position={position}>
      {/* Floor */}
      <mesh
        ref={containerMesh}
        position={[length / 2, thickness / 2, width / 2]}
      >
        <meshStandardMaterial
          ref={material}
          color={color}
        ></meshStandardMaterial>
        <boxGeometry
          ref={geometry}
          args={[length, thickness, width]}
        ></boxGeometry>
      </mesh>

      {/* Back wall */}
      <mesh position={[length / 2, height / 2, 0 - thickness / 2]}>
        <meshStandardMaterial
          ref={material}
          color={color}
        ></meshStandardMaterial>

        <boxGeometry
          ref={geometry}
          args={[length + thickness * 2, height, thickness]}
        ></boxGeometry>
      </mesh>

      {/* Left wall */}
      <mesh position={[-(thickness / 2), height / 2, width / 2]}>
        <meshStandardMaterial
          ref={material}
          color={color}
        ></meshStandardMaterial>

        <boxGeometry
          ref={geometry}
          args={[thickness, height, width]}
        ></boxGeometry>
      </mesh>

      {/* Right wall */}
      <mesh position={[length + thickness / 2, height / 2, width / 2]}>
        <meshStandardMaterial
          ref={material}
          color={color}
        ></meshStandardMaterial>

        <boxGeometry
          ref={geometry}
          args={[thickness, height, width]}
        ></boxGeometry>
      </mesh>

      <group>{children}</group>
    </group>
  );
}
