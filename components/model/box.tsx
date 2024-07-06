"use client"

import {ThreeElements, useFrame, useLoader, useThree} from "@react-three/fiber"
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js';
import {FC, useEffect, useRef} from "react"
import * as THREE from 'three'
import {useEnvironment, useTexture} from "@react-three/drei";

const Box = (props: ThreeElements['mesh']) => {
    const ref = useRef<THREE.Mesh>(null!)
    const texture = new THREE.CanvasTexture(new FlakesTexture())
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 10;
    texture.repeat.y = 6;
    const envMap = useEnvironment({files: 'brown_photostudio_02_4k.hdr'})

    return (
        <mesh {...props} ref={ref} >
            <sphereGeometry args={[170, 170, 170]}/>
            <meshPhysicalMaterial
                map={texture}
                color={0x8418ca}
                clearcoat={1.0}
                clearcoatRoughness={0.1}
                metalness={0.9}
                normalScale={new THREE.Vector2(0.15,0.15)}
                envMap={envMap}
            />
        </mesh>
    )
}

export default Box