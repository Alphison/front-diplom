import Image from 'next/image'
import React, { FC } from 'react'
import { motion } from "framer-motion";
import { modal } from 'animation/animation';

interface PropsType{
    image: string,
    setImage: (image:string | null) => void
}

const ModelLesson:FC<PropsType> = ({image, setImage}) => {
  return (
    <div className='wrapper-model-lesson'>
        <motion.div variants={modal} initial={'hidden'} animate={'visible'} className="model-lesson" onClick={() => setImage(null)}>
            <Image src={image} loader={() => image} alt="" width={1000} height={500}/>
        </motion.div>
    </div>
  )
}

export default ModelLesson