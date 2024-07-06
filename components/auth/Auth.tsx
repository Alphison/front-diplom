import React, { useEffect, useState } from "react";
import "../../src/app/globals.css";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {motion} from "framer-motion";
import { uselogin } from "store/useSign";
import Loader from "../../public/loader/Loader";
import { SubmitHandler } from "react-hook-form/dist/types";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

type Inputs = {
  example: string,
  exampleRequired: string,
  email: string,
  password: string,
};

const Auth = () => {
  const router = useRouter();
  const { loading, error, fetchLogin, status, setStatus} = uselogin(state => ({
    loading: state.loading,
    error: state.error,
    fetchLogin: state.fetchLogin,
    status: state.status,
    setStatus: state.setStatus
}))

const handleSubmitLogin: SubmitHandler<Inputs> = ({password, email}) => {
  fetchLogin({password, email});
}

const message = () => {
  if(status == 200) {
    reset()
    router.push('/')
    return Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Вы успешно авторизовались!',
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

  const [activeEyePassword, setActiveEyePassword] = useState(true)

  const formSchema = Yup.object().shape({
    password: Yup.string()
      .required('Введите пароль'),
    email: Yup.string()
      .required('Введите email')
      .email('Неверный формат электронной почты'),
  })

  const { register, handleSubmit, formState:{errors, isValid}, reset } = useForm<Inputs>({
    mode: 'onChange',
    resolver: yupResolver(formSchema)
  });

  

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
      <h1 className="form-name">Авторизация</h1>
      {error && <motion.div variants={animErrors} initial="hidden" animate="show" className="error">{error}</motion.div>}
      <form className="form-sign" onSubmit={handleSubmit(handleSubmitLogin)}>
        <div className="inputs-form">
          <div className="inp-box">
            <input type="text" placeholder=" " {...register('email')}/>
            <p className="placeholder">Email</p>
            {errors?.email && <motion.div variants={animErrors} initial="hidden" animate="show" className="error">{errors?.email.message}</motion.div>}
          </div>
          <div className="inp-box">
            <input type={activeEyePassword ? "password" : "text"} {...register('password')} placeholder=" " />
            <p className="placeholder">Пароль</p>
            {errors?.password && <motion.div variants={animErrors} initial="hidden" animate="show" className="error">{errors?.password.message}</motion.div>}
            <div className="ikon">
              {
                !activeEyePassword ? <AiFillEye onClick={() => setActiveEyePassword(!activeEyePassword)} /> : <AiFillEyeInvisible onClick={() => setActiveEyePassword(!activeEyePassword)}/>
              }
            </div>
          </div>
        </div>
        <button className="btn-sign" disabled={!isValid}>{loading ? <div className="loader-btn"><Loader /></div> : 'Войти'}</button>
      </form>
    </div>
  );
};

export default Auth;
