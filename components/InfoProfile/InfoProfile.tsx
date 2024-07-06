import React from 'react'
import { FiEdit3 } from 'react-icons/fi'
import { FC } from 'react'
import { uselogin, User } from 'store/useSign';
import {motion} from 'framer-motion'

interface Props {
    setProfile: (profile: boolean) => void;
    user: User | null;
}

const InfoProfile: FC<Props> = ({setProfile, user}) => {
    const handleSetProfile = () => {
        setProfile(false)
    }

    const info = [
        {
            title: 'Имя:',
            value: user?.name
        },
        {
            title: 'Фамилия:',
            value: user?.surname
        },
        {
            title: 'Отчество:',
            value: user?.patronymic
        },
        {
            title: 'Email:',
            value: user?.email
        },
    ]

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

  return (
    <div className='infoprofile'>
        <div className="info-profile">
            {
                info.map((item, index:number) => {
                    return (
                        <motion.label variants={variants} initial='hidden' animate="visible" custom={index} key={index} className='text-profile'>
                            <p className='zag-info'>{item.title}</p>
                            <p className="text-info">{item.value}</p>
                        </motion.label>
                    )
                })
            }
        </div>
        <button className='btn-edit-profile' onClick={() => handleSetProfile()}><FiEdit3 />Редактировать</button>
    </div>
  )
}

export default InfoProfile