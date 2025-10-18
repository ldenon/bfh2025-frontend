import * as THREE from "three";
import { memo, useRef, forwardRef, useEffect } from "react";
import Box from "./meshes/Box";
import Container from "./meshes/Container";
import Cylinder from "./meshes/Cylinder";
import { CameraControls } from "@react-three/drei";
import { useControls, button, buttonGroup } from "leva";
import { useThree } from "@react-three/fiber";
import data from "@/data/data.json";

const { DEG2RAD } = THREE.MathUtils;

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function Scene() {
  const cameraControlsRef = useRef();

  const { camera } = useThree();

  // All same options as the original "basic" example: https://yomotsu.github.io/camera-controls/examples/basic.html
  const { minDistance, enabled, verticalDragToForward } = useControls({
    thetaGrp: buttonGroup({
      label: "rotate theta",
      opts: {
        "+45º": () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
        "-90º": () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
        "+360º": () =>
          cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true),
      },
    }),
    phiGrp: buttonGroup({
      label: "rotate phi",
      opts: {
        "+20º": () => cameraControlsRef.current?.rotate(0, 20 * DEG2RAD, true),
        "-40º": () => cameraControlsRef.current?.rotate(0, -40 * DEG2RAD, true),
      },
    }),
    truckGrp: buttonGroup({
      label: "truck",
      opts: {
        "(1,0)": () => cameraControlsRef.current?.truck(1, 0, true),
        "(0,1)": () => cameraControlsRef.current?.truck(0, 1, true),
        "(-1,-1)": () => cameraControlsRef.current?.truck(-1, -1, true),
      },
    }),
    dollyGrp: buttonGroup({
      label: "dolly",
      opts: {
        1: () => cameraControlsRef.current?.dolly(1, true),
        "-1": () => cameraControlsRef.current?.dolly(-1, true),
      },
    }),
    zoomGrp: buttonGroup({
      label: "zoom",
      opts: {
        "/2": () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
        "/-2": () => cameraControlsRef.current?.zoom(-camera.zoom / 2, true),
      },
    }),
    minDistance: { value: 0 },
    reset: button(() => cameraControlsRef.current?.reset(true)),
    enabled: { value: true, label: "controls on" },
  });

  const getContainerMeshes = (data) => {
    const items = data.items.map((item) => {
      if (item.geometry == "rectangle")
        return (
          <Box
            color={getRandomColor()}
            length={item.width / 100}
            width={item.height / 100}
            position={[item.center_x / 100, item.center_y / 100]}
          ></Box>
        );
      if (item.geometry == "circle")
        return (
          <Cylinder
            color={getRandomColor()}
            radius={item.radius / 100}
            position={[item.center_x / 100, item.center_y / 100]}
          ></Cylinder>
        );
    });

    return (
      <Container
        width={data.container.width / 100}
        length={data.container.height / 100}
      >
        {items}
      </Container>
    );
  };

  return (
    <>
      <ambientLight></ambientLight>
      <directionalLight position={[0, 1, 0]}></directionalLight>

      {getContainerMeshes(data)}

      <group>
        <CameraControls
          ref={cameraControlsRef}
          minDistance={minDistance}
          enabled={enabled}
          verticalDragToForward={verticalDragToForward}
        />
      </group>
    </>
  );
}
