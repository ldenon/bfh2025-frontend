import { useRef, useEffect } from "react";

export default function Box({
  width = 1,
  length = 1,
  height = 1,
  color,
  position = [0, 0],
}) {
  const geometry = useRef();

  useEffect(() => {
    // Décale la géométrie de moitié de sa taille
    geometry.current.translate(0.5, 0.5, 0.5);
  }, []);

  return (
    <mesh position={[position[0], 0.3, position[1]]}>
      <boxGeometry ref={geometry} args={[length, height, width]}></boxGeometry>
      <meshStandardMaterial color={color}></meshStandardMaterial>
    </mesh>
  );
}
