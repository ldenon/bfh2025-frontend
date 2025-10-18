import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
export default function App() {
  return (
    <div className=" p-12 h-screen grid grid-cols-3">
      <div className="col-span-1">
        <h1 className="text-2xl">ORD-2023-1027-A4B8</h1>
      </div>

      <Canvas
        className="col-span-2 bg-white border-1 rounded-lg"
        shadows
        camera={{ position: [-3, 2, 5], fov: 80 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
