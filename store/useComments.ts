import { immer } from 'zustand/middleware/immer'
import { create } from "zustand";
import { CommentBody } from "../types/type"
import axios from 'axios';
import { CommentService } from 'services/Comments.service';



  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API
  

type StateLessons = {
    comments: CommentBody[];
    loading: boolean;
    error: string | null;
    fetchComments: () => void;
    fetchAddComment: (data:CommentBody) => void;
    status: number | null;
    setStatus: () => void;
    addComment: (data:CommentBody) => void;
    fetchCommentDelete: (id:number | undefined) => void;
    deleteComment: (id:number | undefined) => void;
}

export const useComments = create<StateLessons>()(immer(set => ({
    comments: [],
    loading: false,
    error: null,
    status: null,
    fetchComments: async () => {
        set({loading: true})

        try {
            const res = await CommentService.getAll()

            // if(!res.ok) throw new Error('Failed to fetch! Try again')

            set({comments: res})
        } catch(error: any) {
            set({error: error})
        } finally {
            set({loading: false})
        }
    },
    fetchAddComment: async (data) => {
        set({loading: true})

        try {
            const res = await CommentService.addComment(data)
            
            set({status: res.status})

        } catch (error:any) {
            set({error: error.response.data.errors})
        }finally{
            set({loading: false})
            // set({error: null})
        }
    },
    fetchCommentDelete: async (id) => {
        set({loading: true})
        try {
            await CommentService.delete(id!)
        } catch(error: any) {
            set({error: error.response.data})
        } finally {
            set({loading: false})
        }
    },
    deleteComment: (id) => {
        set((state) => {state.comments = state.comments?.filter(item  => item.id !== id)})
    },
    addComment: (data) => set(state => {
        state.comments?.push({text: data.text, user_id: data.user_id, lesson_id: data.lesson_id, created_at: data.created_at})
    }),
    setStatus: () => set({status: null})
})))