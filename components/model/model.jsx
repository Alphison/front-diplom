"use client"

import {Canvas } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Suspense, useState, useEffect} from "react";
import Scene from "./model2";
import { Loader_model } from "./Loader_model";



const Model = ({model, scale, position}) => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
        setProgress((prev) => (prev < 98 ? prev + 2 : prev));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Canvas frameloop="demand" gl={{ alpha: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputEncoding: THREE.sRGBEncoding,
            toneMappingExposure: 1.25 }}
                camera={{position: [0, 0, 370]}}
        >
            <ambientLight intensity={0.1}/>
            <pointLight color={'#fffff'} position={[200, 200 , 200]} intensity={1}/>
            <pointLight color={'#fffff'} position={[-950, 200 , -750]} intensity={1}/>
            <Suspense fallback={<Loader_model progress={progress}/>}>
                <Scene model={model} scale={scale} position={position} onProgress={(event) => setProgress(Math.round((event.loaded / event.total) * 100))}/>
            </Suspense>
            <OrbitControls enableZoom={false} autoRotate={true} enablePan={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI - Math.PI / 2}
        />
        </Canvas>
    )
}

export default Model