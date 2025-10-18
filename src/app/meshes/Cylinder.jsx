import { useRef, useEffect } from "react";

export default function Cylinder({
  radius = 0.5,
  height = 1,
  color,
  position,
}) {
  const geometry = useRef();

  useEffect(() => {
    // Décale la géométrie de moitié de sa taille
    geometry.current.translate(0.5, 0.5, 0.5);
  }, []);

  return (
    <mesh position={[position[0], 0.3, position[1]]}>
      <cylinderGeometry
        ref={geometry}
        args={[radius, radius, height]}
      ></cylinderGeometry>
      <meshStandardMaterial color={color}></meshStandardMaterial>
    </mesh>
  );
}
