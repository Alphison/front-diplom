"use client"

import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { animStat } from 'animation/animation';
import { RiSearchLine } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import { AiFillEdit } from 'react-icons/ai'
import Swal from 'sweetalert2';
import { Loader } from '@react-three/drei';
import { useLessons } from 'store/useLessons';
import Image from 'next/image';

const Courses = () => {
    const {lessons, fetchLessons, fetchLessonDelete, deleteLesson, error, loading} = useLessons(state => ({
        lessons: state.lessons,
        fetchLessons: state.fetchLessons,
        fetchLessonDelete: state.fetchLessonDelete,
        deleteLesson: state.deleteLesson,
        error: state.error,
        loading: state.loading
    }))
    const [search, setSearch] = useState('')

    const lessonsDataSearch = lessons?.filter(item => item.name?.includes(search))

    useEffect(() =>{
        fetchLessons()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

    if(loading){
      return <Loader />
    }

  return (
    <motion.div variants={animStat} initial={'hidden'} animate={'visible'}>
      <div className="row__tabel">
        <form action="">
          <label className="wrapper-search">
            <input type="text" className="inp-search" placeholder="Какой урок найти?" onChange={(e) => setSearch(e.target.value)}/>
            <div className="ikon-search">
                <RiSearchLine />
            </div>
          </label>
        </form>
      </div>
      <div className="table-scroll">
        <table className="table_users" cellSpacing="0">
          <tbody>
              <tr>
                  <th>id</th>
                  <th>Название</th>
                  <th>Превью</th>
                  <th>Действия</th>
              </tr>
              {
                lessonsDataSearch?.length === 0 ? <tr><td><p className="message-null">По вашему запросу никого не найдено...</p></td></tr> :
                lessonsDataSearch?.map((item) => {
                  const src = `${process.env.NEXT_PUBLIC_API}storage/${item.preview}` 
                  return (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td><div className="table-lesson-preview"><Image loader={() => src} src={src} alt={''} width={200} height={100}/></div></td>
                        <td>
                          <button className="ikon_delete-user" onClick={() => modalFunc(item.id)}><AiFillDelete /></button>
                        </td>
                    </tr>
                  )
                })
              }
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default Courses