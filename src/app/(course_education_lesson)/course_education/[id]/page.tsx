'use client'

import { animStat, animStat2 } from 'animation/animation'
import { useLessonCount, useLessonCount2 } from 'hooks/useLessonCount'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { BsBookFill } from 'react-icons/bs'
import { useCourse } from 'store/useCourse'
import { useCategory, useCourses } from 'store/useCourses'
import { useLessonUser } from 'store/useLessonUser'
import { useLessons } from 'store/useLessons'
import { uselogin } from 'store/useSign'
import { motion } from 'framer-motion'
import { HiArrowLeft } from 'react-icons/hi'

const CourseEducation = ({params}:any) => {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState(false)

  const {course, loading, error, fetchCourse} = useCourse(state => ({
    course: state.course,
    loading: state.loading,
    error: state.error,
    fetchCourse: state.fetchCourse
  }))

  const {fetchCourseUpdateActive} = useCourses(state => ({
    fetchCourseUpdateActive: state.fetchCourseUpdateActive
  }))

  const {lesson_user, fetchLessonUser} = useLessonUser(state => ({
    lesson_user: state.lesson_user,
    fetchLessonUser: state.fetchLessonUser
  }))

  const {
    categories,
    loading: Loading,
    error: Error,
    fetchCategory,
  } = useCategory((state) => ({
    loading: state.loading,
    categories: state.categories,
    error: state.error,
    fetchCategory: state.fetchCategory,
  }));

  const {lessons, fetchLessons} = useLessons(state => ({
    lessons: state.lessons,
    fetchLessons: state.fetchLessons,
  }))

  const lessons_course = lessons.filter(lesson => lesson.course_id === course?.data.id)

  const cat = categories?.find(category => category.id === course?.data.category_id)

  const {user} = uselogin(state => ({
    user: state.user,
  }))

  let ls = lessons_course.map(lesson_course => {
      const ls_success = lesson_user?.find(ls => ls.lesson_id === lesson_course.id && ls.user_id === user?.id)

      return ls_success
  })

  const precentOneLesson = 100/lessons_course.length

  const ls_success = ls.filter(ls2 => ls2 !== undefined)
  const precentSuccessLesson = Math.ceil(ls_success.length * precentOneLesson)

  useEffect(() => {
    fetchCourse(params.id)
    fetchCategory()
    fetchLessons()
    fetchLessonUser()
    if(precentSuccessLesson === 100 && course?.data.active === 'false'){
      fetchCourseUpdateActive({id: course.data.id, active: 'true'})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const src = `${process.env.NEXT_PUBLIC_API}storage/${course?.data.img_course}`

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

  const src2 = `${process.env.NEXT_PUBLIC_API}storage/${course?.data.img_course}`

  return (
    <div className='course-education' id='page-wrap'>
        <div className={activeMenu ? "menu__course-education active" : "menu__course-education"}>
            <button className="menu-btn-setActive-courseEducation" onClick={() => setActiveMenu(!activeMenu)}><HiArrowLeft className={activeMenu ? "svg-arrow active" : "svg-arrow"}/></button>
            <motion.div variants={animStat} animate="visible" initial="hidden" custom={1} className="sub-block__course-education">
                <div className="img-block__sub-block">
                    <Image loader={() => src} src={src2} width={100} height={100} alt=''/>
                </div>
                <div className="subinfo__course-education">
                    <h3 className="subname__course-education">
                        Курс
                    </h3>
                    <p className="subname2__course-education">
                        {course?.data.name}
                    </p>
                </div>
            </motion.div>
            <div className="menu-content__course-education">
              {
                lessons_course?.map((item, i) => {
                  const src = `${process.env.NEXT_PUBLIC_API}storage/${item.preview}`
                  return (
                    <motion.div variants={animStat2} animate="visible" initial="hidden" custom={i}
                      key={item.id} className="block-menu__course-education"
                       onClick={() => router.push(`/lesson/${item.id}`)}>
                      <div className="img-block__sub-block">
                          <Image src={src} loader={() => src} width={100} height={100} alt=''/>
                      </div>
                      <div className="subinfo__course-education">
                          <h3 className="subname__course-education">
                              Урок
                          </h3>
                          <p className="subname2__course-education">
                              {item.name}
                          </p>
                      </div>
                  </motion.div>
                  )
                })
              }
            </div>
        </div>
        <div className='content__course-education'>
          <div className="preview__course" style={style}>
            <div className="wrapper-preview__course"></div>
            <div className="info-preview__course">
              <div className="info-preview__course__inner">
                <div className="mini-preview__course">
                  <Image loader={() => src} src={src} width={1558} height={425} alt="" />
                </div>
                <p className="name-course-edication">{course?.data.name}</p>
                <div className="haracters_course">
                  <div className="haracter_course">
                    <div className="el-haracter_course"></div>
                    <p className="name-haracter_course">{cat?.name}</p>
                  </div>
                  <div className="haracter_course">
                    <div className="el-haracter_course"></div>
                    <p className="name-haracter_course">{course?.data.duration}</p>
                  </div>
                  <div className="haracter_course">
                    <div className="el-haracter_course"></div>
                    <div className="name-haracter_course">{lessons_course.length}</div>
                    <div className="name-haracter_course">{useLessonCount2(lessons_course.length)}</div>
                  </div>
                </div>
                <div className="technologies-course">
                  <div className="blender-block">
                    <div className="ikon-techno"><Image width={30} height={24} src="/images/blender.png" alt="" /></div>
                    <p className="name-techno">Blender Technologies</p>
                  </div>
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
                {course?.data.description}
              </p>
            </div>
          </div>
          <div className="lessons-block">
            <div className='hr-el-lessons-block'></div>
            <div className="lessons-block__course-education">
              {
                lessons_course?.map((item) => {
                  const src = `${process.env.NEXT_PUBLIC_API}storage/${item.preview}`
                  const lesson_user_have = lesson_user?.find((item2) => item2.lesson_id === item?.id && item2.user_id === user?.id)
                  return (
                    <div className="lesson-block__course-education" key={item.id}>
                      {
                        lesson_user_have ? <div className="success-lesson"><Image src={'/images/Done.png'} alt="" width={37} height={37}/></div> : null
                      }
                      <button className="el-lesson-block" onClick={() => router.push(`/lesson/${item.id}`)}><Image src={'/images/Frame.png'} width={10} height={16} alt=''/></button>
                      <div className="img-lesson-block__course-education">
                        <Image loader={() => src} src={src} alt="" width={390} height={220}/>
                      </div>
                      <div className="info-lesson-block__course-education">
                        <div className="name-lesson-block__course-education">
                          {item.name}
                        </div>
                        <div className="technologies-course">
                          <div className="ikon-techno"><Image width={30} height={24} src="/images/blender.png" alt="" /></div>
                          <p className="name-techno">Blender Technologies</p>
                          <button className="el-lesson-block2" onClick={() => router.push(`/lesson/${item.id}`)}>
                            <Image src={'/images/Frame.png'} width={10} height={16} alt=''/>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
      </div>
    </div>
  )
}

export default CourseEducation