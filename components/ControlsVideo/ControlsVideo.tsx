import Image from 'next/image'
import React from 'react'

const ControlsVideo = ({handlePlay, __id}:any) => {
  return (
    <>
        <div className="playVideo" onClick={() => handlePlay(__id)}><Image src={'/images/play.png'} width={30} height={30} alt=''/></div>
        <div className='videoControls'>
            ControlsVideo
        </div>
    </>
  )
}

export default ControlsVideo