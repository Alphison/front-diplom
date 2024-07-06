"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useLesson } from 'store/useLesson'
import ReactPlayer from 'react-player'
import ControlsVideo from 'components/ControlsVideo/ControlsVideo'
import ModelLesson from 'components/modelLesson/ModelLesson'
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { uselogin } from 'store/useSign'
import { useLessonUser } from 'store/useLessonUser'
import Swal from 'sweetalert2'
import { redirect, useRouter } from 'next/navigation'
import { MdModeComment } from 'react-icons/md'
import ModelLesson2 from 'components/modelLesson/ModelLesson2'
import { useComments } from 'store/useComments'
import { useAnswers } from 'store/useAnswers'

const Lesson = ({params}:any) => {
  const router = useRouter()
  const [modal, setModal] = useState(false)
  const {lesson, loading, error, fetchLesson} = useLesson(state => ({
    lesson: state.lesson,
    loading: state.loading,
    error: state.error,
    fetchLesson: state.fetchLesson
  }))

  const { answers, fetchAnswers} = useAnswers(state => ({
    fetchAnswers: state.fetchAnswers,
    answers: state.answers
}))

  const { comments, fetchComments} = useComments(state => ({
    fetchComments: state.fetchComments,
    comments: state.comments
  }))

  const { user } = uselogin(state => ({
    user: state.user,
  }))

  const {lesson_user, fetchLessonUser, fetchAddLessonUser, status, addLessonUser} = useLessonUser(state => ({
    lesson_user: state.lesson_user,
    fetchLessonUser: state.fetchLessonUser,
    fetchAddLessonUser: state.fetchAddLessonUser,
    status: state.status,
    addLessonUser: state.addLessonUser
  }))

  const data = {
    lesson_id: lesson?.data.id,
    user_id: user?.id
  }

  const handleAddLessonCourse = () => {
    fetchAddLessonUser({lesson_id: lesson?.data.id, user_id: user?.id})
    addLessonUser(data)
    router.back()
    return Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Вы успешно прошли урок!',
      showConfirmButton: false,
      timer: 2000
    })
  }


    const lesson_user_have = lesson_user?.find((item) => item.lesson_id === lesson?.data.id && item.user_id === user?.id)

  useEffect(() => {
    fetchLessonUser()
    fetchLesson(params.id)
    fetchComments()
    fetchAnswers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const comments2 = comments.filter(comment => comment.lesson_id === lesson?.data.id)


  const answers_count = comments2.map(item => {
    const answer = answers.find(answer => answer.comment_id === item.id)

    return answer
  })
  const answers_count_success = answers_count?.filter(ls2 => ls2 !== undefined)

  const count_comments = answers_count_success.length + comments2.length

  const src = `${process.env.NEXT_PUBLIC_API}storage/${lesson?.data.preview}`

// const [state, setState] = useState<any>()

// useEffect(() => {
//   const videosState:any = []
//   lesson?.data.videos?.map(item => {
//     videosState.push({
//       id: item.id,
//       playing: false,
//     })
//   })
//   setState(videosState)
// }, [])

// console.log(state)
// const handlePlay = (__id:any) => {
//   const copy = [...state]

//   const current = copy.find(video => video.id === __id)
//   current.playing = !current.playing
//   setState(copy)

//   console.log(copy)
// }
const [image, setImage] = useState<string | null>()
const handleImage = (src2:string) => {
  setImage(src2)
}

useEffect(() => {
  const token = JSON.parse(sessionStorage.getItem('access_token')!)
  if(!token){
      redirect('/sign')
  }
}, [])

  if(user){
    if(user?.role == 'Пользователь'){
      redirect('/')
    }
  }

  const style = {
    background: `url(${src}) 0% 0% / cover no-repeat`,
}

  return (
    <div className='content__course-education' id='page-wrap'>
        {
          modal ? <ModelLesson2 setModal={setModal} image={src} name={lesson?.data.name!} lesson_id={lesson?.data.id!}/>
          : null
        }
        {image ? 
        <ModelLesson setImage={setImage} image={image}/> : null}
        <div className="preview__course" style={style}>
          <div className="wrapper-preview__course"></div>
          <div className="info-preview__course">
            <div className="mini-preview__course">
              <Image loader={() => src} src={src} width={1558} height={425} alt="" />
            </div>
            <p className="name-course-edication">{lesson?.data.name}</p>
            <div className="technologies-course">
              <div className="blender-block">
                <div className="ikon-techno"><Image width={30} height={24} src="/images/blender.png" alt="" /></div>
                <p className="name-techno">Blender Technologies</p>
              </div>
              <div className="comment-ikon-block">
                <button className='comment-btn' onClick={() => setModal(true)}><MdModeComment size={20}/></button>
                {count_comments}
              </div>
            </div>
          </div>
        </div>
        <div className="description-block">
          <div className="info-block-description">
            <div className="block-name__description">
              <div className="name-description">Обзор</div>
              <hr className='hr-name-description' />
            </div>
            <h2 className='h2-zag-description'>Описание</h2>
            <p className="text-description">
              {lesson?.data.description}
            </p>
            <h2 className='h2-zag-description'>Задание</h2>
            <p className="text-description">
              {lesson?.data.task}
            </p>
            <h2 className='h2-zag-description'>Скриншоты</h2>
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              freeMode={true}
              modules={[FreeMode, Pagination]}
              className="mySwiper"
            >
              {lesson?.data.images?.map(image => {
                  const src2 = `${process.env.NEXT_PUBLIC_API}storage/${image.img}`
                  return (
                    <SwiperSlide key={image.id} onClick={() => handleImage(src2)}>
                        <Image width={260} height={150} loader={() => src2} src={src2} alt="" />
                    </SwiperSlide>
                  )
                })}
            </Swiper>
          </div>
        </div>
        <div className="videos-lessons-wrapper">
          <div className="videos-lesson">
            <div className="hr__videos-lesson"></div>
            {
              lesson?.data.videos?.map((item, i) => {
                // const video = state.filter((item2:any) => item2.id === item.id);
                // console.log(video)
                return(
                  <div className="video-block" key={i}>
                    <h1 className="id-video">
                    {i + 1}
                    </h1>
                    <div className="video">
                      <ReactPlayer 
                        url={`${process.env.NEXT_PUBLIC_API}storage/${item.video}`}
                        controls={true}
                        playing={false}
                        width="100%"
                        height="100%"
                      />
                      {/* <ControlsVideo
                      /> */}
                    </div>
                  </div>
                )
              })
            }
          </div>
          {
            !lesson_user_have && user?.role === 'Ученик' ? <button className="finish-lesson" onClick={() => handleAddLessonCourse()}>Пометить урок как завершенный</button> : ''
          }
        </div>
    </div>
  )
}

export default Lesson