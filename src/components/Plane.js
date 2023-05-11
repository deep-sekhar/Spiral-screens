import React from "react";
import { usePlane } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Plane = () => {
  /** Plane collider */
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.25, 0],
    material: {
      friction: 0.1
    }
  }));
  const [ref2] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.25, 0],
    material: {
      friction: 0.1
    }
  }));
  

  const gridMap = useLoader(
    THREE.TextureLoader,
    "/grid.png"
  );

  useEffect(() => {
    if (!gridMap) return;
    // increase the texture resolution
    gridMap.anisotropy = 16;
  }, [gridMap]);

  return (
    <>
    <mesh 
          ref={ref2}
          position={[0, -0.11, 0]}
          rotation-x={-Math.PI * 0.5}
          receiveShadow={true}>
      <circleGeometry args={[200, 20]} />
      <meshPhongMaterial color={"#5F9DF7"} receiveShadow />
    </mesh>

    <mesh
        ref={ref}
        position={[0, -0.1, 0]}
        rotation-x={-Math.PI * 0.5}
        receiveShadow={true}
      >
        <circleGeometry args={[200, 20]} />
        <meshStandardMaterial
          opacity={1}
          alphaMap={gridMap}
          transparent={true}
          color={"white"} receiveShadow
        />
    </mesh>
    </>
  );
};
