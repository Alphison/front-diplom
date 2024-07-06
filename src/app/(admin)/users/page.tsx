"use client"

import React, { FC, useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { animStat } from "animation/animation";
import { UsersType, useUsers } from "store/useUser";
import Loader from "public/loader/Loader";
import { TiUserDelete } from "react-icons/ti" 
import Swal from "sweetalert2";

const Users = () => {
  const [cat, setCat] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  const {
    users,
    loading, 
    fetchUsers,
    fetchUserDelete,
    error,
    deleteUser,
    fetchUserUpdate,
    updateUser} = useUsers(state => ({
    users: state.users,
    loading: state.loading,
    fetchUsers: state.fetchUsers,
    fetchUserDelete: state.fetchUserDelete,
    error: state.error,
    deleteUser: state.deleteUser,
    fetchUserUpdate: state.fetchUserUpdate,
    updateUser: state.updateUser
  }))

  const usersData = users?.filter(item => item.role.includes(cat))

  const usersDataSearch = usersData?.filter(item => item.name.includes(search) || item.surname.includes(search) || item.patronymic?.includes(search))
  
  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const modalFunc = async (id:number) => {
    return Swal.fire({
      title: 'Вы хотите удалить пользователя?',
      text: "Вы не сможете отменить это!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5840EA',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да, удалить!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetchUserDelete(id)
        if(error === null){
          Swal.fire(
            'Удалён!',
            'Пользователь успешно удалён',
            'success'
          )
            deleteUser(id)
        }
      }
    })
  }

  const modalFunc2 = async (id:number, role:string) => {
    fetchUserUpdate(id, role)
    if(error === null){
      updateUser(id, role)
      return Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Роль успешно изменена!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  if(loading){
    return <Loader />
  }

  return (
    <motion.div variants={animStat} initial={'hidden'} animate={'visible'}>
      <div className="row__tabel">
        <form>
          <select name="" id="" className="users-inp" onChange={(e) => setCat(e.target.value)}>
            <option >Все</option>
            <option value="Пользователь">Пользователи</option>
            <option value="Ученик">Ученики</option>
            <option value="Преподаватель">Преподаватели</option>
          </select>
        </form>
        <form action="">
          <label className="wrapper-search">
            <input type="text" className="inp-search" placeholder="Кого найти?" onChange={(e) => setSearch(e.target.value)}/>
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
                  <th>ФИО</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Действия</th>
              </tr>
              {
                usersDataSearch?.length === 0 ? <tr><td><p className="message-null">По вашему запросу никого не найдено...</p></td></tr> :
                usersDataSearch?.map((item) => {
                  return (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.surname} {item.name} {item.patronymic}</td>
                        <td>{item.email}</td>
                        <td>{item.role}</td>
                        <td className="btns-table">
                          {
                            item.role === 'Пользователь' && <button className="btn-up-user" onClick={() => modalFunc2(item.id, 'Преподаватель')}>Повысить до преподавателя</button>
                          }
                          {
                            item.role === 'Преподаватель' && <button className="btn-down-user" onClick={() => modalFunc2(item.id, 'Пользователь')}>Понизить до пользователя</button>
                          }
                          <button className="ikon_delete-user" onClick={() => modalFunc(item.id)}><TiUserDelete /></button>
                        </td>
                    </tr>
                  )
                })
              }
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Users;
