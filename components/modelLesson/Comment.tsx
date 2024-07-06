"use client"

import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react'
import { User } from 'store/useSign';
import { AnswerBody, CommentBody } from 'types/type';
import { IoIosArrowDown } from 'react-icons/io';
import { useAnswers } from 'store/useAnswers';
import Swal from 'sweetalert2';

type CommentType = {
    comment: CommentBody,
    users: User[],
    src: string,
    user: User | null,
    fetchCommentDelete: (id:number | undefined) => void,
    deleteComment: (id:number | undefined) => void,
    id_comment?: number
}

const Comment:FC<CommentType> = ({comment, users, user, src, fetchCommentDelete, deleteComment, id_comment}) => {
    const [activeBtnOtvet, setActiveBtnOtvet] = useState(false)
    const [activeFormOtvet, setActiveFormOtvet] = useState(false)

    const [textComment2, setTextComment2] = useState('')
    const {fetchAddAnswer, answers, fetchAnswers, addAnswer, fetchAnswerDelete, deleteAnswer} = useAnswers(state => ({
        fetchAddAnswer: state.fetchAddAnswer,
        fetchAnswers: state.fetchAnswers,
        answers: state.answers,
        addAnswer: state.addAnswer,
        fetchAnswerDelete: state.fetchAnswerDelete,
        deleteAnswer: state.deleteAnswer
    }))

    const handleAddAnswer = ({e, id_comment}:any) => {
        e.preventDefault()
        const formData = new FormData() as any;
    
        formData.append('text', textComment2)
        formData.append('user_id', user?.id)
        formData.append('comment_id', id_comment)
    
        fetchAddAnswer(formData)
        setTextComment2('')
        addAnswer({text: textComment2, comment_id: id_comment, user_id: user?.id!, created_at: new Date()})
    }

    const handleDeleteComment = () => {
        return Swal.fire({
            title: 'Вы хотите удалить комментарий?',
            text: "Вы не сможете отменить это!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5840EA',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да, удалить!',
            cancelButtonText: 'Отмена'
          }).then((result) => {
            if (result.isConfirmed) {
              fetchCommentDelete(id_comment)
                Swal.fire(
                  'Удалён!',
                  'Курс успешно удалён',
                  'success'
                )
                deleteComment(id_comment)
            }
          })
    }

    const handleDeleteAnswer = (id:number | undefined) => {
        return Swal.fire({
            title: 'Вы хотите удалить комментарий?',
            text: "Вы не сможете отменить это!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5840EA',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да, удалить!',
            cancelButtonText: 'Отмена'
          }).then((result) => {
            if (result.isConfirmed) {
              fetchAnswerDelete(id)
                Swal.fire(
                  'Удалён!',
                  'Курс успешно удалён',
                  'success'
                )
                deleteAnswer(id)
            }
          })
    }

    const formatter = new Intl.DateTimeFormat("ru-GB", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      });

      const user2 = users.find(item => item.id === comment.user_id);
      const src2 = `${process.env.NEXT_PUBLIC_API}${user2?.ava}`;
      const answers2 = answers.filter(answer => answer.comment_id === comment.id).reverse()

      useEffect(() => {
        fetchAnswers()
         // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

  return (
    <div className="comment">
        <div className="header-comment">
        <Image src={src2} loader={() => src2} width={32} height={32} alt=''/>
        <p className="fio-comment">{user2?.surname} {user2?.name} {user2?.patronymic}</p>
        <p className="date-comment">{user2?.role}</p>
        </div>
        <p className="text-comment">{comment.text}</p>
        <div className="footer-comment">
        <div className="btns-comment">
            <button onClick={() => setActiveFormOtvet(!activeFormOtvet)}>Ответить</button>
            {
                user2?.id === user?.id && <button onClick={() => handleDeleteComment()}>Удалить</button>
            }
            <button className='otvets-btn' onClick={() => setActiveBtnOtvet(!activeBtnOtvet)}>Ответы<IoIosArrowDown className={activeBtnOtvet ? 'active-btn-otvets' : ''}/></button>
        </div>
        <div>
            <p className="date-comment">{formatter.format(Date.parse(comment.created_at))}</p>
        </div>
        </div>
        {
        activeFormOtvet &&
        <form className='form-comments form-comments2'>
            <Image src={src} loader={() => src} width={32} height={32} alt=''/>
            <input type="text" placeholder='Введите комментарий...' value={textComment2} onChange={(e) => setTextComment2(e.target.value)}/>
            <button onClick={(e) => handleAddAnswer({e, id_comment:comment.id})} disabled={textComment2 === '' ? true : false}>Ответить</button>
        </form>
        }
        {
        activeBtnOtvet &&
        answers2.map(answer => {
            const user3 = users.find(item => item.id === answer.user_id);
            const src3 = `${process.env.NEXT_PUBLIC_API}${user3?.ava}`;

            return (
            <div className="otvets-block" key={answer.id}>
                <div className="comment2">
                <div className="header-comment">
                    <Image src={src3} loader={() => src3} width={32} height={32} alt=''/>
                    <p className="fio-comment">{user3?.surname} {user3?.name} {user3?.patronymic}</p>
                    <p className="date-comment">{user3?.role}</p>
                </div>
                <p className="text-comment">{answer.text}</p>
                <div className="footer-comment">
                    <div className="btns-comment">
                    {
                        user3?.id === user?.id && <button onClick={() => handleDeleteAnswer(answer.id)}>Удалить</button>
                    }
                    </div>
                    <div>
                    <p className="date-comment">{formatter.format(Date.parse(answer.created_at))}</p>
                    </div>
                </div>
                </div>
            </div>
            )
        })
        }
    </div>
  )
}

export default Comment