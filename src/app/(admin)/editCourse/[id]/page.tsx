"use client"

import React, { useState, useEffect, FC } from 'react'
import { motion } from "framer-motion"
import { animErrors, animStat } from 'animation/animation'
import { FiDownload } from "react-icons/fi"
import Image from 'next/image'
import { useCategory, useCourses } from 'store/useCourses'
import { CourseDataType, useCourse } from 'store/useCourse'
import { useUsers } from 'store/useUser'
import { CourseType } from 'types/type'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { useForm } from 'react-hook-form'
import Loader from 'public/loader/Loader'
import { SubmitHandler } from "react-hook-form/dist/types";

type Inputs = {
    name: string,
    description: string,
    duration: string,
    profession: string,
    goal: string,
  };

const EditCourse:FC = ({params}:any) => {
    const {course, fetchCourse} = useCourse(state => ({
        course: state.course,
        fetchCourse: state.fetchCourse
    }))

    const src = `${process.env.NEXT_PUBLIC_API}storage/${course?.data.img_course}`    

    const [image, setImage] = useState('')
    const [foto, setFoto] = useState('')
    const {categories, fetchCategory} = useCategory(state => ({categories: state.categories, fetchCategory: state.fetchCategory}))
    const {users, fetchUsers} = useUsers(state => ({users: state.users, fetchUsers: state.fetchUsers}))
    const {fetchUpdateCourse, error, status, loading, setStatus} = useCourses(state => ({fetchUpdateCourse: state.fetchUpdateCourse, error: state.error, status: state.status, loading: state.loading, setStatus: state.setStatus}))
    const [courseOne, setCourse] = useState({ user_id: 0, category_id: 0})

    const cat = categories.find(item => item.id === course?.data.category_id)
    const user = users.find(item => item.id === course?.data.user_id)


    useEffect(() => {
        fetchCategory()
        fetchUsers()
        fetchCourse(params.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onImageChange = (event:any) => {
        if (event.target.files && event.target.files[0]) {
          setImage(URL.createObjectURL(event.target.files[0]));
          setFoto(event.target.files[0])
        }
    }

    const onChangeSelectForm = (e:any) => {
        setCourse((prevState:any) => {
            prevState = {...prevState}
            prevState[e.target.name] = e.target.options[e.target.selectedIndex].value
            return prevState
        })
    }

    const submit: SubmitHandler<Inputs> = ({name, duration, description, goal, profession}) => {
        const data = new FormData() as any
        data.append('name', name)
        data.append('description', description)
        data.append('duration', duration)
        data.append('user_id', courseOne?.user_id === 0 ? course?.data.user_id : courseOne?.user_id)
        data.append('category_id', courseOne?.category_id === 0 ? course?.data.category_id : courseOne?.category_id)
        data.append('profession', profession)
        data.append('goal', goal)
        data.append('price', 0)
        data.append('img_course', foto)
        data.append('_method', 'PUT')
        fetchUpdateCourse(data, params.id)
    }

    const message = () => {
        if(status == 200){
            return Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Вы успешно изменили курс!',
                showConfirmButton: false,
                timer: 2000
            })
        }
    }

    useEffect(() => {
        message()
        setStatus()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    const formSchema = Yup.object().shape({
        name: Yup.string()
          .required('Введите название'),
        duration: Yup.string()
          .required('Введите продолжительность'),
        description: Yup.string()
        .required('Введите описание'),
        user_id: Yup.string()
          .required('Выберите преподавателя'),
        category_id: Yup.string()
          .required('Выберите уровень знаний'),
        profession: Yup.string()
          .required('Введите описание профессии'),
        goal: Yup.string()
          .required('Введите цель курса'),
      })
    
      const { register, handleSubmit, formState:{errors, isValid}, reset, setValue } = useForm<CourseType>({
        mode: 'onChange',
        resolver: yupResolver(formSchema)
      });

      useEffect(() => {
        if(course){
            setValue('name', course.data.name)
            setValue('duration', course.data.duration)
            setValue('description', course.data.description)
            setValue('profession', course.data.profession)
            setValue('goal', course.data.goal)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [course])

      if(!course){
        return (
            <div className="loader-wrapper">
                <Loader />
            </div>
        )
      }
        
  return (
    <motion.form className='add-course__wrapper' onSubmit={handleSubmit(submit)} variants={animStat} initial={'hidden'} animate={'visible'}>
        <h1 className='zag-page-edit'>Редактирование курса</h1>
        <h3 className="name-image-input">
            Изображение курса:
        </h3>
        <label htmlFor="">
            <label htmlFor="image" className="wrapper-input">
                <input type="file" name="photo" id="image" onChange={(e) => onImageChange(e)}/>
                <Image loader={() => image ? image : src} src={image ? image : src} width={1234} height={511} alt={'add-image'}/>
                <div className="ikon_label-image">
                    <FiDownload />
                </div>
            </label>
            {
                error ?
                error?.map((item:any, i:number) => {
                    return (
                        <p className="error" key={i}>{item}</p>
                    )
                })
                : null
            }
        </label>
        
        <label htmlFor="" className='label-add-course'>
            <input {...register('name')} type="text" placeholder='Название курса' className='inp-text-add'/>
            {errors?.name && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.name.message}</motion.p>}
        </label>
        <label htmlFor="" className='label-add-course'>
            <input {...register('duration')} type="text" placeholder='Продолжительность курса' className='inp-text-add'/>
            {errors?.duration && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.duration.message}</motion.p>}
        </label>
        <label htmlFor="" className='label-add-course'>
            <select {...register('category_id')} id="" className='inp-text-add' onChange={onChangeSelectForm.bind(this)}>
                <option selected value={cat?.id}>{cat?.name}</option>
                {
                    categories.map(category => {
                        return (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        )
                    })
                }
            </select>
            {errors?.category_id && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.category_id.message}</motion.p>}
        </label>
        <label htmlFor="" className='label-add-course'>
            <select {...register('user_id')} id="" className='inp-text-add' onChange={onChangeSelectForm.bind(this)}>
                <option selected value={user?.id}>{user?.name}{user?.surname}</option>
                {
                    users.map(prepod => {
                        if(prepod.role === 'Преподаватель'){
                            return (
                                <option key={prepod.id} value={prepod.id}>{prepod.name}</option>
                            )
                        }
                    })
                }
            </select>
            {errors?.user_id && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.user_id.message}</motion.p>}
        </label>
        <label htmlFor="" className='label-add-course'>
            <textarea {...register('description')} id="" placeholder='Описание курса'></textarea>
            {errors?.description && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.description.message}</motion.p>}
        </label>
        <label htmlFor="" className='label-add-course'>
            <textarea {...register('profession')} id="" placeholder='О профессии'></textarea>
            {errors?.profession && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'></motion.p>}
        </label>
        <label htmlFor="" className='label-add-course'>
            <textarea {...register('goal')} id="" placeholder='Цель курса'></textarea>
            {errors?.goal && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'></motion.p>}
        </label>
        <button className='btn-add-course' disabled={!isValid} onClick={handleSubmit(submit)}>{loading ? <Loader /> : 'Сохранить'}</button>
    </motion.form>
  )
}

export default EditCourse