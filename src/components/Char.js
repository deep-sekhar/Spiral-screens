import React, { useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials, animations } = useLoader(FBXLoader, "models/dance/Remy.fbx");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    console.log(actions);
    actions.Armada.play();
  });

  return (
    <group ref={group} position={[5, 0, 2]} {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={[0.01, 0.01, 0.01]}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          material={materials.Ch03_Body}
          geometry={nodes.Ch03.geometry}
          skeleton={nodes.Ch03.skeleton}
        />
      </group>
    </group>
  );
}
