"use client"

import { useFrame, useLoader } from '@react-three/fiber'
import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { modelType } from './model'
import { AnimationMixer } from 'three'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three';

const Scene = ({model, scale, position}) => {
  const {nodes, materials, animations, scene} = useGLTF(model)
  const group = useRef();
  const {actions, names} = useAnimations(animations, group)
  useEffect(() => {
    actions[names[0]]?.play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <primitive
        object={scene}
        ref={group}
        position={position}
        scale={scale}
      />
    </>
  );
}

export default Scene