import * as THREE from 'three'
import { forwardRef, useState, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useVideoTexture, Grid, Center, AccumulativeShadows, RandomizedLight, Environment, useGLTF, CameraControls } from '@react-three/drei'
import { useControls, button } from 'leva'
import CurvedPlane from './CurvedPlane'

const { DEG2RAD } = THREE.MathUtils

// List of films from https://gist.github.com/jsturgis/3b19447b304616f18657
const films = {
  Sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'Big Buck Bunny': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'Elephant Dream': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'For Bigger Blazes': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'For Bigger Joy Rides': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
}

export default function App() {
  return (
    <Canvas shadows camera={{ position: [4, 3, 12], fov: 60 }}>
      <Scene />

      <Ground />
      <AccumulativeShadows frames={100} color="#9d4b4b" colorBlend={0.5} alphaTest={0.9} scale={20}>
        <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
      </AccumulativeShadows>

      <CameraControls />
      <Environment preset="city" />
    </Canvas>
  )
}

// The <AccumulativeShadows> component is used to create realistic shadows in the scene. It is a custom component built on top of Three.js that accumulates multiple frames of the scene with different light positions to create more realistic shadows.

// scale is a property that controls the resolution of the shadow map. A shadow map is a 2D texture that is used to store information about shadows in the scene. The scale property determines how many pixels in the shadow map correspond to one unit of distance in the scene. A higher scale value will result in a higher resolution shadow map, but it can also be more computationally expensive to render.

// frames is a property that determines the number of frames of the scene that are used to accumulate the shadows. Accumulating the shadows over multiple frames helps to reduce the visibility of flickering or jittering in the shadows. By combining the shadows from multiple frames, the shadows appear more stable and smooth over time. A higher number of frames can result in more stable shadows, but it can also increase the amount of time it takes to render the scene.

// The <RandomizedLight> component is used to create a light source that is randomized with each frame of the accumulated shadows. This creates the effect of the shadows changing slightly over time, which can add more realism to the scene. The amount prop sets how many randomized light positions to use, and the radius prop sets the radius of the randomized light positions. The position prop sets the initial position of the light source.

function Scene() {
  const [stream, setStream] = useState(new MediaStream())

  const { url } = useControls({
    url: {
      value: films['Sintel'],
      options: films
    },
    'getDisplayMedia (only new-window)': button(async (get) => {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      setStream(mediaStream)
    })
  })

  return (
    <>
      <Center top>
        <Suzi rotation={[-0.63, 0, 0]} />
      </Center>

      <group rotation-y={DEG2RAD * 40}>
        <Screen src={url} />
      </group>
      <group rotation-y={DEG2RAD * 120}>
        <Screen src={url} />
      </group>
      <group rotation-y={DEG2RAD * 200}>
        <Screen src={url} />
      </group>

      {/* <group rotation-y={DEG2RAD * -40}>
        <Screen src={stream} />
      </group> */}
    </>
  )
}

function Screen({ src }) {
  const [video, setVideo] = useState()

  const ratio = 16 / 9
  const width = 5
  const radius = 4
  const z = 4

  const r = useMemo(() => (video ? video.videoWidth / video.videoHeight : ratio), [video, ratio])

  return (
    <Center top position-z={z}>
      <CurvedPlane width={width} height={width / r} radius={radius}>
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

  return <meshStandardMaterial side={THREE.DoubleSide} map={texture} toneMapped={false} transparent opacity={0.9} />
}

//
//
//

function Ground() {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: '#6f6f6f',
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: '#9d4b4b',
    fadeDistance: 30,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true
  }
  return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
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