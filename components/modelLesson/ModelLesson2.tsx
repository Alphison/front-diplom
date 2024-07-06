"use client"

import React, { FC, useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { modal2 } from 'animation/animation';
import Image from 'next/image';
import { AiFillCloseCircle } from 'react-icons/ai';
import { uselogin } from 'store/useSign';
import { useComments } from 'store/useComments';
import { useUsers } from 'store/useUser';
import Comment from './Comment';

interface PropsType{
    setModal: (modal:boolean) => void;
    image: string;
    name: string;
    lesson_id: number;
}

const ModelLesson2:FC<PropsType> = ({setModal, name, image, lesson_id}) => {
  const {user} = uselogin(state => ({user: state.user}))
  const [textComment, setTextComment] = useState('')
  const {fetchAddComment, comments, fetchComments, addComment, fetchCommentDelete, deleteComment} = useComments(state => ({
    fetchAddComment: state.fetchAddComment,
    fetchComments: state.fetchComments,
    comments: state.comments,
    addComment: state.addComment,
    fetchCommentDelete: state.fetchCommentDelete,
    deleteComment: state.deleteComment
  }))

  

  const {users, fetchUsers} = useUsers(state => ({
    users: state.users,
    fetchUsers: state.fetchUsers
  }))

  const handleAddComment = (e:any) => {
      e.preventDefault()
      const formData = new FormData() as any;

      formData.append('text', textComment)
      formData.append('user_id', user?.id)
      formData.append('lesson_id', lesson_id)

      fetchAddComment(formData)
      setTextComment('')
      addComment({text: textComment, lesson_id: lesson_id, user_id: user?.id!, created_at: new Date()})
  }

  useEffect(() => {
    fetchComments()
    fetchUsers()
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const comments2 = comments.filter(comment => comment.lesson_id === lesson_id).reverse()
  
  const src = `${process.env.NEXT_PUBLIC_API}${user?.ava}`;

  return (
    <div className='wrapper-model-lesson2' onClick={() => setModal(false)}> 
        <motion.div variants={modal2} initial={'hidden'} animate={'visible'} className="modal-comments-inner" onClick={(e) => e.stopPropagation()}>
          <div className="header-modal-lesson">
            <Image src={image} loader={() => image} width={90} height={50} alt=''/>
            <h3>{name}</h3>
            <button onClick={() => setModal(false)}><AiFillCloseCircle size={30}/></button>
          </div>
          <div className="comments-block">
            <form className='form-comments' onSubmit={(e) => handleAddComment(e)}>
              <Image src={src} loader={() => src} width={32} height={32} alt=''/>
              <input type="text" placeholder='Введите комментарий...' value={textComment} onChange={(e) => setTextComment(e.target.value)}/>
              <button onClick={(e) => handleAddComment(e)} disabled={textComment === '' ? true : false}>Оставить комментарий</button>
            </form>
            {
              comments2?.map(comment => {

                return (
                <Comment key={comment.id} comment={comment} users={users} src={src} user={user} fetchCommentDelete={fetchCommentDelete} deleteComment={deleteComment} id_comment={comment.id}/>
              )})
            }
          </div>
        </motion.div>
    </div>
  )
}

export default ModelLesson2