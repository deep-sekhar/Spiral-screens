import * as THREE from 'three'
// viginnete effect 
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette
} from "@react-three/postprocessing";

// character animation 
import Kick from './Kick'
import Model from './Char'

// ===
import { forwardRef, useState, Suspense, useMemo , useEffect} from 'react'
import { Canvas } from '@react-three/fiber'
import { useVideoTexture, Grid, Center, AccumulativeShadows, RandomizedLight, Environment, useGLTF, CameraControls } from '@react-three/drei'
import { useControls, button } from 'leva'
import CurvedPlane from './CurvedPlane'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useRef } from 'react';
import {Plane} from './Plane';
import { Physics } from "@react-three/cannon";

import classes from './Loader.module.css'

const { DEG2RAD } = THREE.MathUtils

// List of films from https://gist.github.com/jsturgis/3b19447b304616f18657
const films = {
  '1':'./videos/t1.mp4',
  '2':'./videos/t2.mp4',
  '3':'./videos/t3.mp4',
  '4':'./videos/t4.mp4',
}

const VioletScreen = () => {
  console.log("VioletScreen");
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);

  //   return () => clearTimeout(timeout);
  // }, []);

  return (
    <div className={classes.loader}>
    </div>
  );
};

export default function Spiral() {
  const controlsRef = useRef();

  return (
    <>
    <div className={classes.bg1}> </div>
    <Canvas shadows camera={{ position: [4, 2.2, 6.5], fov: 60,target: [0, 2.2, 0] }}
    onCreated={({ gl, camera }) => {
      // Add OrbitControls to the camera
      const controls = new OrbitControls(camera, gl.domElement);
      controlsRef.current = controls;

      // Set constraints
      controls.minDistance = 7.6; // Minimum distance to the target
      controls.maxDistance = 7.9 // Maximum distance to the target

      // var controls = new THREE.OrbitControls(camera);
      controls.enablePan = false;
      controls.enableZoom = false; 
      controls.enableDamping = true;
      // controls.minPolarAngle = 0.8;
      // controls.maxPolarAngle = 2.4;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.4;

      // // Update the camera position if it goes below the ground
      controls.addEventListener('change', () => {
        if (camera.position.y < 2.2 || camera.position.y > 2.2) {
          camera.position.setY(2.2);
          // camera.updateProjectionMatrix();
        }
      }
      );
    }}
    >
    <Suspense fallback={null}>
        {/* <Kick /> */}
        {/* <Model/> */}
      </Suspense>
      <Physics
        gravity={[0, -9.8, 0]}
        // error limit 
        tolerance={0.05}
        // no of reloads to stimulate movement 
        iterations={50}
        broadphase={"SAP"}
      >

      <Scene />

      {/* <Ground /> */}
      <Plane />
      </Physics>
      <AccumulativeShadows frames={100} color="#9d4b4b" colorBlend={0.5} alphaTest={0.9} scale={20}>
      <ambientLight color="white" intensity={0.07} />
      {/* <pointLight  position={[0, 5, -0]} intensity={3} color={"#ffffff"} /> */}
        <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
      </AccumulativeShadows>

      <Environment preset="night" />

      {/* <EffectComposer multisampling={0} disableNormalPass={true}>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          height={200}
          opacity={3}
        />
        <Noise opacity={0.025} />
        <Vignette eskil={false} offset={0.1} darkness={.9} />
      </EffectComposer> */}

    </Canvas>
    </>
  )
}

// The <AccumulativeShadows> component is used to create realistic shadows in the scene. It is a custom component built on top of Three.js that accumulates multiple frames of the scene with different light positions to create more realistic shadows.

// scale is a property that controls the resolution of the shadow map. A shadow map is a 2D texture that is used to store information about shadows in the scene. The scale property determines how many pixels in the shadow map correspond to one unit of distance in the scene. A higher scale value will result in a higher resolution shadow map, but it can also be more computationally expensive to render.

// frames is a property that determines the number of frames of the scene that are used to accumulate the shadows. Accumulating the shadows over multiple frames helps to reduce the visibility of flickering or jittering in the shadows. By combining the shadows from multiple frames, the shadows appear more stable and smooth over time. A higher number of frames can result in more stable shadows, but it can also increase the amount of time it takes to render the scene.

// The <RandomizedLight> component is used to create a light source that is randomized with each frame of the accumulated shadows. This creates the effect of the shadows changing slightly over time, which can add more realism to the scene. The amount prop sets how many randomized light positions to use, and the radius prop sets the radius of the randomized light positions. The position prop sets the initial position of the light source.

function Scene() {
  // set the video source 
  const [stream, setStream] = useState(new MediaStream())

  // drop down for video source
  // const { url } = useControls({
  //   url: {
  //     value: films['Sintel'],
  //     options: films
  //   },
  //   'getDisplayMedia (only new-window)': button(async (get) => {
  //     const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
  //     setStream(mediaStream)
  //   })
  // })

  // viginette
  // const effectVignette = useMemo(() => new ShaderPass(VignetteShader), []);
  // effectVignette.enabled = true;
  // effectVignette.uniforms.offset.value = 0.5;
  // effectVignette.uniforms.darkness.value = 0.5;


  return (
    <>
      {/* <Center top>
        <Suzi rotation={[-0.63, 0, 0]} />
      </Center> */}

      <group rotation-y={DEG2RAD * 40}>
        <Screen src={films['1']} col="yellow" />
      </group>
      <group rotation-y={DEG2RAD * 130}>
      <Screen src={films['3']} col="violet"/>
      </group>
      <group rotation-y={DEG2RAD * 220}>
      <Screen src={films['4']} col="rgb(103, 255, 156)"/>
      </group>
      <group rotation-y={DEG2RAD * 310}>
      <Screen src={films['2']} col="red"/>
      </group>
      {/* <group rotation-y={DEG2RAD * 310}>
        <Screen src={url} />
      </group> */}

      {/* <group rotation-y={DEG2RAD * -40}>
        <Screen src={stream} />
      </group> */}

      {/* viginette */}


    </>
  )
}

function Screen({ src, col }) {
  const [video, setVideo] = useState()

  const ratio = 16 / 9
  const width = 5
  const radius = 4
  const z = 4

  const r = useMemo(() => (video ? video.videoWidth / video.videoHeight : ratio), [video, ratio])

  return (
    <Center top position-z={z}>
      <CurvedPlane width={width} height={width / r} radius={radius} col={col}>
        <Suspense fallback={<meshStandardMaterial side={THREE.DoubleSide} wireframe />}>
          <VideoMaterial src={src} setVideo={setVideo} />
        </Suspense>
      </CurvedPlane>
    </Center>
  )
}

function VideoMaterial({ src, setVideo }) {
  const texture = useVideoTexture(src)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  // texture.repeat.x = -1
  // texture.offset.x = 1

  setVideo?.(texture.image)

  return <meshStandardMaterial side={THREE.DoubleSide} map={texture} toneMapped={false} transparent opacity={1} />
}

//
//
//

function Ground() {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: 'white',
    sectionSize: 3,
    sectionThickness: 1.1,
    sectionColor: 'yellow',
    fadeDistance: 30,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true
  }

    // Define a material for the grid
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(gridConfig.cellColor),
      // reflectivity: 0.5, // Set the reflectivity to a value between 0 and 1
    });
  
    return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} material={material} {...gridConfig} />

  // return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
}

const Suzi = forwardRef((props, ref) => {
  const { nodes } = useGLTF('https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf')
  return (
    <>
      <mesh ref={ref} castShadow receiveShadow geometry={nodes.Suzanne.geometry} {...props}>
        <meshStandardMaterial color="#9d4b4b" />
      </mesh>
    </>
  )
})
