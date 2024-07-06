"use client"

import Loader from 'public/loader/Loader'
import React, { useEffect, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { useCategory } from 'store/useCourses'
import { CategoryType } from 'types/type'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { useForm } from 'react-hook-form'
import { motion } from "framer-motion"
import { animErrors } from 'animation/animation'

const Category_admin = () => {
    const {categories, fetchCategory, loading, fetchAddCategory, deleteCategory, setStatus, status, fetchCategoryDelete, error} = useCategory(state => ({
        categories: state.categories,
        fetchCategory: state.fetchCategory,
        loading: state.loading,
        fetchAddCategory: state.fetchAddCategory,
        deleteCategory: state.deleteCategory,
        setStatus: state.setStatus,
        status: state.status,
        fetchCategoryDelete: state.fetchCategoryDelete,
        error: state.error,
    }))

    useEffect(() => {
        fetchCategory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [cat, setCat] = useState<CategoryType>({name: ''})

    const handleInput = (e:any) => {
        setCat({...cat, [e.target.name]: e.target.value})
    }

    const formSchema = Yup.object().shape({
        name: Yup.string()
          .required('Введите название'),
      })
    
      const { register, handleSubmit, formState:{errors, isValid}, reset } = useForm<CategoryType>({
        mode: 'onBlur',
        resolver: yupResolver(formSchema)
      });

      const submit = (e:any) => {
        e.preventDefault()
        const data = new FormData() as any
        data.append('name', cat.name)
        fetchAddCategory(data)
    }

    const message = () => {
        if(status == 201){
            reset()
            fetchCategory()
            return Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Вы успешно добавили категорию!',
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

    const modalFunc = async (id:any) => {
        return Swal.fire({
          title: 'Вы хотите удалить категорию?',
          text: "Вы не сможете отменить это!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#5840EA',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Да, удалить!'
        }).then((result) => {
          if (result.isConfirmed) {
            fetchCategoryDelete(id)
            if(error === null){
              Swal.fire(
                'Удалён!',
                'Категория успешна удалена',
                'success'
              )
              deleteCategory(id)
            }
          }
        })
      }

    loading && <Loader />
  return (
    <div className='categories-wrapper'>
        <div className="col__categories-wrapper">
            {
                categories.map(cat => {
                    return (
                        <div key={cat.id} className="category-block">
                            <p className="name-cat__categories-wrapper">{cat.name}</p>
                            <button className="ikon_delete-user" onClick={() => modalFunc(cat.id)}><AiFillDelete /></button>
                        </div>
                    )
                })
            }
        </div>
        <div className="col__categories-wrapper">
            <form onSubmit={(e) => submit(e)}>
                <div className="inp-box">
                    <input type="text" {...register('name')} onChange={(e) => handleInput(e)} placeholder=" " className='input-pole-add-cat'/>
                    <p className="placeholder">Название</p>
                    {errors?.name && <motion.div variants={animErrors} initial="hidden" animate="show" className="error">{errors?.name.message}</motion.div>}
                </div>
                <button className='btn-add-cat' disabled={!isValid} onClick={(e) => submit(e)}>{loading ? <Loader /> : 'Добавить'}</button>
            </form>
        </div>
    </div>
  )
}

export default Category_admin