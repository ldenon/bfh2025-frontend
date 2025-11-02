import { useRef } from "react";

export default function Container({
  length = 1,
  width = 1,
  height = 1,
  thickness = 0.015,
  color = "#4a90e2",
  position,
  children,
}) {
  const geometry = useRef();
  const material = useRef();
  const containerMesh = useRef();

  const wallY = height / 2 + thickness / 2;

  return (
    <group position={position}>
      {/* Floor */}
      <mesh ref={containerMesh} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          ref={material}
          color={color}
          metalness={0.8}
          roughness={0.2}
        />
        <boxGeometry
          ref={geometry}
          args={[length + 2 * thickness, thickness, width + 2 * thickness]}
        />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, wallY, -width / 2 - thickness / 2]} castShadow>
        <meshStandardMaterial
          ref={material}
          color={color}
          metalness={0.8}
          roughness={0.2}
        />

        <boxGeometry
          ref={geometry}
          args={[length + thickness * 2, height, thickness]}
        ></boxGeometry>
      </mesh>
      {/* Front wall */}
      {/* <mesh
        position={[0, wallY, width / 2 + thickness / 2]}
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
          args={[length + thickness * 2, height, thickness]}
        ></boxGeometry>
      </mesh> */}
      {/* Left wall */}
      <mesh position={[-length / 2 - thickness / 2, wallY, 0]} castShadow>
        <meshStandardMaterial
          ref={material}
          color={color}
          metalness={0.8}
          roughness={0.2}
        />

        <boxGeometry
          ref={geometry}
          args={[thickness, height, width]}
        ></boxGeometry>
      </mesh>

      {/* Right wall */}
      <mesh position={[length / 2 + thickness / 2, wallY, 0]} castShadow>
        <meshStandardMaterial
          ref={material}
          color={color}
          metalness={0.8}
          roughness={0.2}
        />

        <boxGeometry
          ref={geometry}
          args={[thickness, height, width]}
        ></boxGeometry>
      </mesh>
      <group>{children}</group>
    </group>
  );
}
