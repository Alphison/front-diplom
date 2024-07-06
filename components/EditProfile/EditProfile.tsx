import React, { FC, useState } from 'react'
import { uselogin, User } from 'store/useSign';
import {motion} from 'framer-motion'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { animErrors } from 'animation/animation';

interface Props {
    setProfile: (profile: boolean) => void;
    user: User | null
}

type Inputs = {
    'name': string,
    'surname': string,
    'patronymic': string,
    'email': string,
};

const EditProfile:FC<Props> = ({setProfile, user}) => {


    const handleSetProfile = () => {
        setProfile(true)
    }

    const { fetchUpdateProfile, access_token, getToken, error} = uselogin(state => ({ fetchUpdateProfile: state.fetchUpdateProfile, access_token: state.access_token, getToken: state.getToken, error: state.error}))

    const [userInfo, setInfoProfile] = useState({name: user?.name, surname: user?.surname, patronymic: user?.patronymic, email: user?.email})

    const handleInput = (e:any) => {
        setInfoProfile({...userInfo, [e.target.name]: e.target.value})
    }

    const variants = {
        visible: (i:number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.2,
            }
        }),
        hidden: {
            opacity: 0,
            x: -100
        }
    }
    const variants2 = {
        visible: (i:number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.2,
            }
        }),
        hidden: {
            opacity: 0,
            x: 100
        }
    }

    const submit = (e:any) => {
        e.preventDefault()
        const data = new FormData() as any
        data.append('name', userInfo.name)
        data.append('surname', userInfo.surname)
        data.append('patronymic', userInfo.patronymic)
        data.append('email', userInfo.email)
        getToken()
        fetchUpdateProfile({access_token, data})
    }

    const formSchema = Yup.object().shape({
        name: Yup.string()
          .required('Введите имя'),
        surname: Yup.string()
          .required('Введите фамилию'),
        patronymic: Yup.string()
        .required('Введите отчество'),
        email: Yup.string()
          .required('Введите email')
          .email('Неверный формат электронной почты'),
      })
    
      const { register, handleSubmit:handleSubmitInfo, formState:{errors} } = useForm<Inputs>({
        mode: 'onBlur',
        resolver: yupResolver(formSchema)
      });

  return (
    <form onSubmit={(e) => submit(e)} className='infoprofile'>
        <div className='edit-profile-form'>
            <label className='block-info-input'>
                <motion.p variants={variants} initial='hidden' animate='visible' custom={1} className='zag-info'>Имя:</motion.p>
                <div className="input-block-profile">
                    <motion.input {...register('name')} className={errors?.name && 'error-input'}  variants={variants2} initial='hidden' animate='visible' custom={1} type='text' onChange={(e) => handleInput(e)} value={userInfo.name}/>
                    {errors?.name && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.name.message}</motion.p>}
                </div>
            </label>
            <label className='block-info-input'>
                <motion.p variants={variants} initial='hidden' animate='visible' custom={2} className='zag-info'>Фамилия:</motion.p>
                <div className="input-block-profile">
                    <motion.input {...register('surname')} className={errors?.surname && 'error-input'} variants={variants2} initial='hidden' animate='visible' custom={2} type='text' onChange={(e) => handleInput(e)} value={userInfo.surname}/>
                    {errors?.surname && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.surname.message}</motion.p>}
                </div>
            </label>
            <label className='block-info-input'>
                <motion.p variants={variants} initial='hidden' animate='visible' custom={3} className='zag-info'>Отчество:</motion.p>
                <div className="input-block-profile">
                    <motion.input {...register('patronymic')} className={errors?.patronymic && 'error-input'} variants={variants2} initial='hidden' animate='visible' custom={3} type='text' onChange={(e) => handleInput(e)} value={userInfo.patronymic}/>
                    {errors?.patronymic && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.patronymic.message}</motion.p>}
                </div>
            </label>
            <label className='block-info-input'>
                <motion.p variants={variants} initial='hidden' animate='visible' custom={4} className='zag-info'>Email:</motion.p>
                <div className="input-block-profile">
                    <motion.input {...register('email')} className={errors?.email || error ? 'error-input' : ''} variants={variants2} initial='hidden' animate='visible' custom={4} type='text' onChange={(e) => handleInput(e)} value={userInfo.email}/>
                    {errors?.email && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{errors?.email.message}</motion.p>}
                    {error?.email && <motion.p variants={animErrors} initial={'hidden'} animate={'show'} className='error'>{error?.email}</motion.p>}
                </div>
            </label>
        </div>
        <div className="btns-edit-info">
            <button className="btn-save-info" onClick={(e) => submit(e)}>
                Сохранить
            </button>
            <button className="btn-cancel-info" onClick={() => handleSetProfile()}>
                Отмена
            </button>
        </div>
    </form>
  )
}

export default EditProfile