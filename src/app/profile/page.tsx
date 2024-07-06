"use client"

import React, { useEffect } from 'react'
import { useState } from 'react'
import '../globals.css'
import { FiDownload } from 'react-icons/fi'
import InfoProfile from '../../../components/InfoProfile/InfoProfile'
import EditProfile from 'components/EditProfile/EditProfile'
import {motion} from 'framer-motion'
import { uselogin } from 'store/useSign'
import Image from 'next/image'
import Loader from 'public/loader/Loader'
import { redirect } from 'next/navigation';

const Profile = () => {
    const [profile, setProfile] = useState(true)
    const [image, setImage] = useState('/images/null.png')
    const [ava, setAva] = useState('')
    const { access_token, fetchUpdateAvatar, getToken, error, loading, user } = uselogin(state => ({
        access_token: state.access_token,
        fetchUpdateAvatar: state.fetchUpdateAvatar,
        error: state.error,
        loading: state.loading,
        getToken: state.getToken,
        user: state.user
    }))

    const onImageChange = (event:any) => {
        if (event.target.files && event.target.files[0]) {
          setImage(URL.createObjectURL(event.target.files[0]));
          setAva(event.target.files[0])
        }
    }
    const submitForm = (e:any) => {
        e.preventDefault()
        const data = new FormData() as any
        data.append('ava', ava as any)
        getToken()
        fetchUpdateAvatar({data, access_token})
    }

    const animAva = {
        visible: (i:number) => ({
            opacity: 1,
            transform: 'scale(1)',
            transition: {
                delay: i * 0.2,
            }
        }),
        hidden: {
            opacity: 0,
            transform:'scale(0)'
        }
    }



    // const handleSubmitImg: SubmitHandler<Inputs> = ({data}:any) => {
    //     console.log(data)
    // }

    const src = `${process.env.NEXT_PUBLIC_API}${user?.ava}`;

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('access_token')!)
        if(!token){
            redirect('/sign')
        }
    }, [])

  return (
    <div className='profile-wrapper' id='page-wrap'>
        <h1 className='zag-profile'>
            Профиль
        </h1>
        <div className="profile-container">
            <div className="profile-column">
                <div className="img-profile">
                    {
                        loading ? <Loader /> : (
                            <Image loader={() => src} src={src} alt={'avatar'} width={400} height={400}/>
                        )
                    }
                </div>
                {
                    error ?
                    error?.ava?.map((item:any, i:number) => {
                        return (
                            <motion.p key={i} variants={animAva} initial={'hidden'} animate={'visible'} custom={i} className="error">{item}</motion.p>
                        )
                    })
                    : null
                }
                <form className="row-profile-column" onSubmit={(e) => submitForm(e)}>
                    <label className="block-new-ava" htmlFor='inp-img'>
                        <input type="file" id='inp-img' name='file' onChange={(event) => onImageChange(event)}/>
                        <p>LOGO</p>
                        <motion.div variants={animAva} initial='hidden' animate="visible" className="img-block-new-ava">
                            <Image src={image} width={95} height={95} alt="new ava"/>
                        </motion.div>
                    </label>
                    <button className='btn-file-profile' type='submit' onClick={(e) => submitForm(e)}><FiDownload />Загрузить фото</button>
                </form>
            </div>
            <div className="profile-column">
                {
                    profile?
                        <InfoProfile setProfile={setProfile} user={user}/>
                        :
                        <EditProfile setProfile={setProfile} user={user}/>
                }
            </div>
        </div>
    </div>
  )
}

export default Profile