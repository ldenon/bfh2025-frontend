import { useRef } from "react";

export default function Container({
  length = 1,
  width = 1,
  height = 1,
  thickness = 0.3,
  color = "#4a90e2",
  position,
  children,
}) {
  const geometry = useRef();
  const material = useRef();
  const containerMesh = useRef();

  return (
    <group position={position}>
      {/* Floor */}
      <mesh
        ref={containerMesh}
        position={[length / 2, thickness / 2, width / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          ref={material}
          color={color}
          metalness={0.8}
          roughness={0.2}
        />
        <boxGeometry ref={geometry} args={[length, thickness, width]} />
      </mesh>
      {/* Back wall */}
      <mesh
        position={[length / 2, height / 2 + 0.3, width + thickness / 2]}
        castShadow
      >
        <meshStandardMaterial
          ref={material}
          color={color}
          metalness={0.8}
          roughness={0.2}
        />

        <boxGeometry
          ref={geometry}
          args={[length + thickness * 2, height + 0.6, thickness]}
        ></boxGeometry>
      </mesh>
      {/* Left wall */}
      <mesh
        position={[-(thickness / 2), height / 2 + 0.3, width / 2]}
        castShadow
      >
        <meshStandardMaterial
          ref={material}
          color={color}
          metalness={0.8}
          roughness={0.2}
        />

        <boxGeometry
          ref={geometry}
          args={[thickness, height + 0.6, width]}
        ></boxGeometry>
      </mesh>

      {/* Right wall */}
      <mesh
        position={[length + thickness / 2, height / 2 + 0.3, width / 2]}
        castShadow
      >
        <meshStandardMaterial
          ref={material}
          color={color}
          metalness={0.8}
          roughness={0.2}
        />

        <boxGeometry
          ref={geometry}
          args={[thickness, height + 0.6, width]}
        ></boxGeometry>
      </mesh>
      <group>{children}</group>
    </group>
  );
}
