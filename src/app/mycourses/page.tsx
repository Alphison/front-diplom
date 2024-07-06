"use client"

import React, { useEffect } from 'react'
import { useCourses } from 'store/useCourses'
import { uselogin } from 'store/useSign'
import { motion } from 'framer-motion'
import { animStat } from 'animation/animation'
import { useRouter } from 'next/navigation'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { useLessons } from 'store/useLessons'
import Swal from 'sweetalert2'
import { useCourseUser } from 'store/useCourseUser'
import { useUsers } from 'store/useUser'
import { redirect } from 'next/navigation'

const Mycourses = () => {
    const router = useRouter();
    const {courses, fetchCourses} = useCourses(state => ({
        courses: state.courses,
        fetchCourses: state.fetchCourses
    }))

    const { course_user, fetchCourseUser } = useCourseUser(state => ({
        course_user: state.course_user,
         fetchCourseUser: state.fetchCourseUser
    }))
    const {users, fetchUsers} = useUsers(state => ({
        users: state.users,
         fetchUsers: state.fetchUsers
    }))

    const {lessons, fetchLessons, fetchLessonDelete, deleteLesson, error} = useLessons(state => ({
        lessons: state.lessons,
        fetchLessons: state.fetchLessons,
        fetchLessonDelete: state.fetchLessonDelete,
        deleteLesson: state.deleteLesson,
        error: state.error
    }))

    useEffect(() => {
        fetchCourses()
        fetchLessons()
        fetchCourseUser()
        fetchUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { user } = uselogin(state => ({
        user: state.user
      }))

      const courses_prepod = courses?.filter(item => item.user_id === user?.id)
      const count_courses = courses_prepod?.length

      const modalFunc = async (id:any) => {
        return Swal.fire({
          title: 'Вы хотите удалить урок?',
          text: "Вы не сможете отменить это!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#5840EA',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Да, удалить!'
        }).then((result) => {
          if (result.isConfirmed) {
            fetchLessonDelete(id)
            if(error === null){
              Swal.fire(
                'Удалён!',
                'Урок успешно удалён',
                'success'
              )
              deleteLesson(id)
            }
          }
        })
      }

      useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('access_token')!)
        if(!token){
            redirect('/sign')
        }
    }, [])
    
    if(user){
        if(user?.role !== 'Преподаватель'){
            redirect('/')
          }
    }
    
  return (
    <div className="mycourses" id="page-wrap">
        <h1 className="h1__mycourses">
            Мои курсы
        </h1>
        <div className="row__courses">
            <p className="count-courses">
                Всего курсов: {count_courses}
            </p>
        </div>
        {
            !count_courses ? <h2 className='message_mycourses'>У вас пока не курсов...</h2> :

            courses_prepod?.map(item => {
                const lessons_course = lessons.filter(lesson => lesson.course_id === item.id)
                const course_user2 = course_user?.filter(item2 => item2.course_id === item.id)
                return (
                    <div className="block__courses-prepod" key={item.id}>
                        <div className="block__course-prepod__inner">
                            <div className="column__courses-prepod">
                                <div className="row__column-courses-prepod">
                                    <motion.h3 variants={animStat} animate={'visible'} initial={'hidden'} className="name-mycourses" onClick={() => router.push(`/course_education/${item.id}`)}>
                                    {item.name}
                                    </motion.h3>
                                    <p className="count__lesson">
                                        Количество уроков: {lessons_course.length}
                                    </p>
                                </div>
                                <button onClick={() => router.push(`/addLesson/${item.id}`)} className="btn-column__courses-prepod">
                                    Добавить урок
                                </button>
                            </div>
                            <hr/>
                            <div className="column__courses-prepod">
                                <p className="name__column-courses-prepod">
                                    Пользователи курса:
                                </p>
                                <div className="table__scroll">
                                    <table className="table__courses-prepod" cellSpacing="0">
                                        <tr><th className="th-first">id</th><th>ФИО</th><th>Email</th></tr>
                                        {
                                            course_user2?.map(item4 => {
                                                const course_users = users?.find(user => user.id === item4?.user_id)
                                                return (
                                                    <tr key={item4.user_id}>
                                                        <td className="th-first">{course_users?.id}</td>
                                                        <td>{course_users?.surname} {course_users?.name} {course_users?.patronymic}</td>
                                                        <td>{course_users?.email}</td>
                                                    </tr> 
                                                )
                                            })
                                        }                                           
                                    </table>
                                </div>
                            </div>
                        </div>
                        <hr className='hr_course_prepod'/>
                        <div className="table__lessons">
                            <p className="name__column-courses-prepod">
                                Уроки:
                            </p>
                            <div className="table__scroll">
                                <table className="table__courses-prepod" cellSpacing="0">
                                    <tr><th className="th-first">id</th><th>Название</th><th>Действия</th></tr>
                                        {lessons_course.map((lesson) => {
                                            return (
                                                <tr key={lesson.id}>
                                                    <td className="th-first">{lesson.id}</td>
                                                    <td>{lesson.name}</td>
                                                    <td>
                                                        <button className="ikon_delete-user" onClick={() => modalFunc(lesson.id)}><AiFillDelete /></button>
                                                    </td>
                                                </tr> 
                                            )
                                        })}                                           
                                </table>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    </div>
  )
}

export default Mycourses