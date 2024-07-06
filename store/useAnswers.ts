import { immer } from 'zustand/middleware/immer'
import { create } from "zustand";
import axios from 'axios';
import { CommentService } from 'services/Comments.service';
import { AnswerBody } from 'types/type';
import { AnswerService } from 'services/Answers.service';



  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API
  

type StateLessons = {
    answers: AnswerBody[];
    loading: boolean;
    error: string | null;
    fetchAnswers: () => void;
    fetchAddAnswer: (data:AnswerBody) => void;
    status: number | null;
    setStatus: () => void;
    addAnswer: (data:AnswerBody) => void;
    fetchAnswerDelete: (id:number | undefined) => void;
    deleteAnswer: (id:number | undefined) => void;
}

export const useAnswers = create<StateLessons>()(immer(set => ({
    answers: [],
    loading: false,
    error: null,
    status: null,
    fetchAnswers: async () => {
        set({loading: true})

        try {
            const res = await AnswerService.getAll()

            // if(!res.ok) throw new Error('Failed to fetch! Try again')

            set({answers: res})
        } catch(error: any) {
            set({error: error})
        } finally {
            set({loading: false})
        }
    },
    fetchAddAnswer: async (data) => {
        set({loading: true})

        try {
            const res = await AnswerService.addAnswer(data)
            
            set({status: res.status})

        } catch (error:any) {
            set({error: error.response.data.errors})
        }finally{
            set({loading: false})
            // set({error: null})
        }
    },
    fetchAnswerDelete: async (id) => {
        set({loading: true})
        try {
            await AnswerService.delete(id!)
        } catch(error: any) {
            set({error: error.response.data})
        } finally {
            set({loading: false})
        }
    },
    deleteAnswer: (id) => {
        set((state) => {state.answers = state.answers?.filter(item  => item.id !== id)})
    },
    addAnswer: (data) => set(state => {
        state.answers?.push({text: data.text, user_id: data.user_id, comment_id: data.comment_id, created_at: data.created_at})
    }),
    setStatus: () => set({status: null})
})))