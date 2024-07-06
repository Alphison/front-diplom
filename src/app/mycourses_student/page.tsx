"use client"

import { getColorByPercentage } from 'hooks/useColor'
import { useLessonCount } from 'hooks/useLessonCount'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useCourseUser } from 'store/useCourseUser'
import { useCategory, useCourses } from 'store/useCourses'
import { useLessonUser } from 'store/useLessonUser'
import { useLessons } from 'store/useLessons'
import { uselogin } from 'store/useSign'
import { redirect } from 'next/navigation'
import { motion } from "framer-motion";
import { animH1, variantsCategory, variantsCourses } from 'animation/animation'
import Loader from 'public/loader/Loader'

const Mycourses_student = () => {
    const router = useRouter();
    const { course_user, fetchCourseUser, loading } = useCourseUser(state => ({
        course_user: state.course_user,
         fetchCourseUser: state.fetchCourseUser,
         loading: state.loading
        }))
    const {courses, fetchCourses} = useCourses(state => ({
        courses: state.courses,
        fetchCourses: state.fetchCourses,
        fetchCourseUpdateActive: state.fetchCourseUpdateActive
    }))
    const {categories, fetchCategory} = useCategory(state => ({categories: state.categories, fetchCategory: state.fetchCategory}))
    const { user } = uselogin(state => ({
        user: state.user
      }))
    const {lessons, fetchLessons, error} = useLessons(state => ({
        lessons: state.lessons,
        fetchLessons: state.fetchLessons,
        error: state.error
    }))
    const {lesson_user, fetchLessonUser} = useLessonUser(state => ({
        lesson_user: state.lesson_user,
        fetchLessonUser: state.fetchLessonUser
    }))
    const [cat, setCatId] = useState('');

    useEffect(() => {
        fetchCourseUser()
        fetchCourses()
        fetchLessons()
        fetchCategory()
        fetchLessonUser()
        const token = JSON.parse(sessionStorage.getItem('access_token')!)
        if(!token){
            redirect('/sign')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const course_user2 = course_user?.filter(item => item.user_id === user?.id)
    const courses__user = course_user2?.map(item => {
        const courses_User = courses?.find(item2 => item2.id === item.course_id && item2.active.includes(cat))

        return courses_User
    })
    const courses__user_success = courses__user?.filter(ls2 => ls2 !== undefined)

    if(!course_user2){
        return <h2>Вы пока не записаны на курсы...</h2>
    }

    if(user){
        if(user?.role !== 'Ученик'){
            redirect('/')
        }
    }

    if(loading){
        return (
            <div className="loader-wrapper">
                <Loader />
            </div>
        )
    }

  return (
    <div className="mycourses" id='page-wrap'>
        <motion.h1 variants={animH1} animate="visible" initial="hidden" className="h1__mycourses">
            Мои курсы
        </motion.h1>
        <div className="row__courses">
            <div className="category category__courses">
                <motion.button
                    variants={variantsCategory}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    className={cat === '' ? "cat-el active" : "cat-el"}
                    onClick={() => setCatId('')}
                >Все</motion.button>
                <motion.button
                    variants={variantsCategory}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    className={cat === 'false' ? "cat-el active" : "cat-el"}
                    onClick={() => setCatId('false')}
                >Активные</motion.button>
                <motion.button
                    variants={variantsCategory}
                    initial="hidden"
                    animate="visible"
                    custom={3}
                    className={cat === 'true' ? "cat-el active" : "cat-el"}
                    onClick={() => setCatId('true')}
                >Завершенные</motion.button>
            </div>
            <p className="count-courses">
                Всего курсов: {courses__user_success?.length}
            </p>
        </div>
        {
            courses__user_success?.map((item, i) => {
                
                const lessons_course = lessons.filter(lesson => lesson.course_id === item?.id)
                const cat = categories?.find(category => category.id === item?.category_id)
                
                let ls = lessons_course.map(lesson_course => {
                    const ls_success = lesson_user?.find(ls => ls.lesson_id === lesson_course.id && ls.user_id === user?.id)

                    return ls_success
                })

                const precentOneLesson = 100/lessons_course.length

                const ls_success = ls.filter(ls2 => ls2 !== undefined)
                const precentSuccessLesson = Math.ceil(ls_success.length * precentOneLesson)

                const ls_unsuccess = ls.filter(ls2 => ls2 === undefined)

                // const count_lesson = useLessonCount(lessons_course.length)

                return (
                    <div key={i} className="block__mycourses">
                        <div className="col__mycourses">
                            <p className="subname-mycourses">
                                {cat?.name}
                            </p>
                            <h1 className="name-mycourses">
                                {item?.name}
                            </h1>
                            <div className="row__mycourses">
                                <p className="count__lessons">
                                    {lessons_course.length} уроков
                                </p>
                                {
                                    precentSuccessLesson === 100 ?
                                        <p className="status__course2">
                                            Завершенный
                                        </p>
                                    :
                                        <p className="status__course">
                                            Активный
                                        </p>
                                }
                            </div>
                        </div>
                        <hr/>
                        <div className="rigth__column">
                            <div className="col__mycourses">
                                <div className="row-col__mycourses">
                                    <div className="info-row-col-mycourses">
                                        <h1>Уроков</h1>
                                        <p>
                                            Пройдено: <span className="count-lesson-success">{ls_success.length}</span>
                                        </p>
                                        <p>
                                            Осталось: <span className="count-lesson-unsuccess">{ls_unsuccess.length}</span>
                                        </p>
                                    </div>
                                    <div className="block_next-lesson">
                                        <Image onClick={() => router.push(`/course_education/${item?.id}`)} src="/images/arrow-right.png" width={24} height={24} alt=""/>
                                    </div>
                                </div>
                                <div className="row-col__mycourses">
                                    <p>Прогресс <span className="count-lesson-percent">{precentSuccessLesson ? precentSuccessLesson : 0}</span>%</p>
                                    <div className="wrapper-progress-bar">
                                        <div className="progress-bar" style={
                                            {
                                                width: `${precentSuccessLesson ? precentSuccessLesson : 0}%`,
                                                background: `${getColorByPercentage(precentSuccessLesson)}`
                                            }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    </div>
  )
}

export default Mycourses_student