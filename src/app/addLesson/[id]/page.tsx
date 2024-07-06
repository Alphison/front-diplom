"use client"

import React, { FC, useEffect, useState } from 'react'
import { motion } from "framer-motion"
import Image from 'next/image'
import { FiDownload } from 'react-icons/fi'
import { BsPlus } from 'react-icons/bs'
import Swal from 'sweetalert2'
import Loader from 'public/loader/Loader'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { animErrors, animStat } from 'animation/animation'
import { LessonType } from 'types/type'
import { useLessons } from 'store/useLessons'
import { animH1 } from 'animation/animation'
import { redirect } from 'next/navigation'
import { uselogin } from 'store/useSign'
import { SubmitHandler } from "react-hook-form/dist/types";
import { AiFillCloseCircle, AiOutlineClose } from 'react-icons/ai'

type Inputs = {
    name: string,
    description: string,
    task: string,
  };

const AddLesson:FC = ({params}:any) => {
    const { user } = uselogin(state => ({
        user: state.user
    }))

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

    const [foto, setFoto] = useState()
    const [fotos, setFotos] = useState<File[]>([])
    const [videos, setVideos] = useState<File[]>([])
    const { fetchAddLesson, error, status, loading, setStatus, percent } = useLessons(state => ({
        fetchAddLesson: state.fetchAddLesson,
        error: state.error, status: state.status,
        loading: state.loading,
        setStatus: state.setStatus,
        percent: state.percent
    }))

    const [image, setImage] = useState('/images/null.png')
    const onImageChange = (event:any) => {
        if (event.target.files && event.target.files[0]) {
          setImage(URL.createObjectURL(event.target.files[0]));
          setFoto(event.target.files[0])
        }
    }

    const [images, setImages] = useState<string[]>([])
    const onImagesChange = (event:any) => {
        if (event.target.files && event.target.files[0]) {
            setImages(prevState => {
                const clone = [...prevState]
                for(let i = 0; i < event.target.files.length; i++) {
                    clone.push(URL.createObjectURL(event.target.files[i]))
                }
                return clone
            })
            setFotos(prevState => {
                const clone = [...prevState]
                for(let i = 0; i < event.target.files.length; i++) {
                    clone.push(event.target.files[i])
                }
                return clone
            })
        }
    }
    const handleDeleteImage = (i:number) => {
        setImages(prev => {
            const clone = [...prev]
            const newState = clone.filter((_, id) => id !== i)
            return newState
        })
        setFotos(prev => {
            const clone = [...prev]
            const newState = clone.filter((_, id) => id !== i)
            return newState
        })
    }

    const onVideosChange = (e:any) => {
        if (e.target.files && e.target.files[0]) {
            setVideos(prevState => {
                const clone = [...prevState]
                for(let i = 0; i < e.target.files.length; i++) {
                    clone.push(e.target.files[i])
                }
                return clone
            })
        }
    }
    const handleDeleteVideo = ({e, i}:any) => {
        e.preventDefault()
        setVideos(prev => {
            const clone = [...prev]
            const newState = clone.filter((_, id) => id !== i)
            return newState
        })
    }

    const Submit: SubmitHandler<Inputs> = ({name, description, task}) => {
        
        const data = new FormData() as any
        data.append('name', name)
        data.append('description', description)
        data.append('preview', foto)
        data.append('task', task)
        fotos.forEach(file => {
            data.append('img[]', file);
        });
        videos.forEach(file => {
            data.append('video[]', file);
        });
        data.append('course_id', params.id)
        fetchAddLesson(data)
    }

    const message = () => {
        if(status == 200){
            reset()
            setFoto(undefined)
            setFotos([])
            setVideos([])
            setImage('/images/null.png')
            setImages([])
            return Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Вы успешно добавили урок!',
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
        description: Yup.string()
          .required('Введите описание урока'),
      })
    
    const { register, handleSubmit, formState:{errors}, reset } = useForm<LessonType>({
        mode: 'onSubmit',
        resolver: yupResolver(formSchema)
    });

  return (
    <div className='add-course__wrapper-wrapper'>
        <motion.form className='add-course__wrapper add-course__wrapper' onSubmit={handleSubmit(Submit)} variants={animStat} initial={'hidden'} animate={'visible'} id='pagw-wrap'>
            <h1 className='zag__add-lesson'>Добавить урок</h1>
            <h3 className="name-image-input">
                Обложка урока:
            </h3>
            <label htmlFor="">
                <label htmlFor="image" className="wrapper-input">
                    <input type="file" name="preview" id="image" onChange={(e) => onImageChange(e)}/>
                    <Image src={image} width={1234} height={511} alt={'add-image'}/>
                    <div className="ikon_label-image">
                        <FiDownload />
                    </div>
                </label>
                {
                    error ?
                    error.preview?.map((item:any, i:number) => {
                        return (
                            <p key={i} className="error">{item}</p>
                        )
                    })
                    : null
                }
            </label>
            <label htmlFor="">
                <h3 className="name-image-input">
                    Дополнительные изображения для урока:
                </h3>
                <div className='images__block-lesson_add'>
                    {
                        images.map((image, i) => {
                            return (
                                <motion.div key={i} variants={animH1} animate={'visible'} initial={'hidden'} className="img-block-add-lesson">
                                    <div className="delete-image-add-lesson" onClick={() => handleDeleteImage(i)}>
                                        <AiFillCloseCircle size={30}/>
                                    </div>
                                    <Image src={image} width={350} height={200} alt=''/>
                                </motion.div>
                            )
                        })
                    }
                    <label htmlFor="images" className="wrapper-input-images">
                        <input type="file" multiple name="images" id="images" onChange={(e) => onImagesChange(e)}/>
                        <div className="ikon_label-image">
                            <BsPlus />
                        </div>
                    </label>
                </div>
                {
                    error &&
                    Object.keys(error).map((key) => {
                        if(key.includes('img')){
                            for (let index = 0; index < error[key].length; index++) {
                                    return (
                                        <p className='error'>{index}-{error[key][index]}</p>
                                    )
                                
                            }
                        }

                        return null
                    })
                }
            </label>
            <label htmlFor="" className='label-add-course'>
                <input {...register('name')} type="text" placeholder='Название урока' className='inp-text-add' />
                {errors?.name && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.name.message}</motion.p>}
            </label>
            <label htmlFor="" className='label-add-course'>
                <input {...register('task')} type="text" placeholder='Задание' className='inp-text-add' />
                {errors?.task && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.task.message}</motion.p>}
            </label>
            <label htmlFor="video-inp" className='label-add-course'>
                <div className='input-wrapper-add-video'>
                    Выберите видео
                    <div className="block-name-video-input">
                        {
                            videos.map((video, i) => {
                                return (
                                    <motion.p key={i} variants={animH1} animate={'visible'} initial={'hidden'} className="name-video-input">{video.name}
                                    <div className="delete-video-add-lesson" onClick={(e) => handleDeleteVideo({e, i})}>
                                        <AiOutlineClose size={20}/>
                                    </div>
                                    </motion.p>
                                )
                            })
                        }
                    </div>
                </div>
                <input name='video[]' multiple type="file" placeholder='Видео' id='video-inp' className='inp-text-add inp-add-video' onChange={(e) => onVideosChange(e)}/>
                {
                    error &&
                    Object.keys(error).map((key) => {
                        console.log(error)
                        if(key.includes('video')){
                            for (let index = 0; index < error[key].length; index++) {
                                    return (
                                        <p className='error'>{index}-{error[key][index]}</p>
                                    )
                                
                            }
                        }

                        return null
                    })
                }
            </label>
            <label htmlFor="" className='label-add-course'>
                <textarea {...register('description')} id="" placeholder='Описание урока' ></textarea>
                {errors?.description && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.description.message}</motion.p>}
            </label>
            {
                loading && percent ? 
                <div className="add-progress-bar-wrapper">
                    <div className="add-progress-bar" style={{
                        width: `${percent}%`
                    }}>{percent+'%'}</div>
                </div>
                :
                <button className='btn-add-course'>Добавить</button>
            }
        </motion.form>
    </div>
  )
}

export default AddLesson