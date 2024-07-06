import React, { FC, useEffect, useState } from "react";
import "../../src/app/globals.css";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import { motion } from "framer-motion";
import { Sign } from "services/Sign.service";
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useRegister } from "store/useSign";
import Loader from "../../public/loader/Loader";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";

type Inputs = {
  example: string,
  exampleRequired: string,
  email: string,
  name: string,
  password: string,
  surname: string,
  patronymic: string,
  password_confirmation: string,
};

type Props = {
  setActive: (active:string) => void,
}

const Register:FC<Props> = ({setActive}) => {
  const { loading, error, fetchRegister, status, setStatus} = useRegister(state => ({
    loading: state.loading,
    error: state.error,
    message: state.message,
    fetchRegister: state.fetchRegister,
    status: state.status,
    setStatus: state.setStatus
}))

  const [activeEyePassword, setActiveEyePassword] = useState(true)
  const [activeEyePassword2, setActiveEyePassword2] = useState(true)

  const formSchema = Yup.object().shape({
    password: Yup.string()
      .required('Введите пароль')
      .min(6, 'Пароль должен быть не менее 6 символов'),
    password_confirmation: Yup.string()
      .required('Повторите пароль')
      .oneOf([Yup.ref('password')], 'Пароли должны совпадать'),
    name: Yup.string()
      .required('Введите имя'),
    surname: Yup.string()
    .required('Введите фамилию'),
    email: Yup.string()
    .required('Введите email')
    .email('Неверный формат электронной почты'),
  })

  const { register, handleSubmit, formState:{errors, isValid}, reset } = useForm<Inputs>({
    mode: 'onChange',
    resolver: yupResolver(formSchema)
  });

  const onSubmit: SubmitHandler<Inputs> = ({name, surname, patronymic, password, email}) => {
    fetchRegister({name, surname, patronymic, password, email});
  }

  const message = () => {
    if(status == 201) {
      reset()
      setActive('Авторизация')
      return Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Вы успешно зарегистрировались!',
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

  const animErrors = {
    hidden: { opacity: 0, x: 20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <div className="form-wrapper">
      <h1 className="form-name">Регистрация</h1>
      {error && <motion.div variants={animErrors} initial="hidden" animate="show" className="error">{error}</motion.div>}
      <form className="form-sign" onSubmit={handleSubmit(onSubmit)}>
        <div className="inputs-form">
          <div className="inp-box">
            <input type="text" placeholder=" " {...register('email')}/>
            <p className="placeholder">Email</p>
            {errors?.email && <motion.div variants={animErrors} initial="hidden" animate="show" className="error">{errors?.email.message}</motion.div>}
          </div>
          <div className="inp-box">
            <input type="text" placeholder=" " {...register('name')}/>
            <p className="placeholder">Имя</p>
            {errors?.name && <motion.div variants={animErrors} initial="hidden" animate="show" className="error">{errors?.name.message}</motion.div>}
          </div>
          <div className="inp-box">
            <input type="text" placeholder=" " {...register('surname')}/>
            <p className="placeholder">Фамилия</p>
            {errors?.surname && <motion.div variants={animErrors} initial="hidden" animate="show" className="error">{errors?.surname.message}</motion.div>}
          </div>
          <div className="inp-box">
            <input type="text" placeholder=" " {...register('patronymic',)}/>
            <p className="placeholder">Отчество</p>
          </div>
          <div className="inp-box">
            <input type={activeEyePassword ? "password" : "text"} placeholder=" " {...register('password')}/>
            <p className="placeholder">Пароль</p>
            <div className="ikon">
              {
                !activeEyePassword ? <AiFillEye onClick={() => setActiveEyePassword(!activeEyePassword)} /> : <AiFillEyeInvisible onClick={() => setActiveEyePassword(!activeEyePassword)}/>
              }
            </div>
            {errors?.password && <motion.div variants={animErrors} initial="hidden" animate="show" className="error">{errors?.password.message}</motion.div>}
          </div><div className="inp-box">
            <input type={activeEyePassword2 ? "password" : "text"} placeholder=" " {...register('password_confirmation')}/>
            <p className="placeholder">Подтверждение пароля</p>
            <div className="ikon">
              {
                !activeEyePassword2 ? <AiFillEye onClick={() => setActiveEyePassword2(!activeEyePassword2)} /> : <AiFillEyeInvisible onClick={() => setActiveEyePassword2(!activeEyePassword2)}/>
              }
            </div>
            {errors?.password_confirmation && <motion.div variants={animErrors} initial="hidden" animate="show" className="error">{errors?.password_confirmation.message}</motion.div>}
          </div>
        </div>
        <button className="btn-sign" disabled={!isValid}>{loading ? <div className="loader-btn"><Loader /></div> : 'Регистрация'}</button>
      </form>
    </div>
  );
};

export default Register;
