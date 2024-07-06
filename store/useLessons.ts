import { immer } from 'zustand/middleware/immer'
import { create } from "zustand";
import { LessonType } from "../types/type"
import { LessonService } from 'services/Lesson.service';
import axios from 'axios';

interface MyObject {
    [key: string]: string[];
  }

  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API
  

type StateLessons = {
    lessons: LessonType[];
    loading: boolean;
    error: MyObject | null;
    fetchLessons: () => void;
    fetchAddLesson: (data:LessonType) => void;
    status: number | null;
    percent: number | null;
    setStatus: () => void;
    fetchLessonDelete: (id:number) => void;
    deleteLesson: (id:number) => void;
    // fetchUpdateCourse: (data:CourseType, id:number,) => void
}

export const useLessons = create<StateLessons>()(immer(set => ({
    lessons: [],
    loading: false,
    error: null,
    status: null,
    percent: 0,
    fetchLessons: async () => {
        set({loading: true})

        try {
            const res = await LessonService.getAll()

            // if(!res.ok) throw new Error('Failed to fetch! Try again')

            set({lessons: res.data})
        } catch(error: any) {
            set({error: error})
        } finally {
            set({loading: false})
        }
    },
    fetchAddLesson: async (data) => {
        set({loading: true})

        try {
            const res = await axios.post<LessonType>(`api/lessons`, data, {
                onUploadProgress: (data) => {
                    set({percent: Math.round((data.loaded / data.total!) * 100)})
                },
                headers: {
                    'Accept': 'application/json'
                }
            })
            
            set({status: res.status})

        } catch (error:any) {
            set({error: error.response.data.errors})
        }finally{
            set({loading: false})
            // set({error: null})
        }
    },
    fetchLessonDelete: async (id:number) => {
        set({loading: true})
        try {
            await LessonService.delete(id)
        } catch(error: any) {
            set({error: error.response.data})
        } finally {
            set({loading: false})
        }
    },
    // fetchUpdateCourse: async (data, id) => {
    //     set({loading: true})
    //     try {
    //         const res = await CourseService.update(data, id)
    //     } catch(error: any) {
    //         set({error: error.response.data})
    //     } finally {
    //         set({loading: false})
    //     }
    // },
    deleteLesson: (id:number) => {
        set((state) => {state.lessons = state.lessons.filter(item  => item.id !== id)})
    },
    setStatus: () => set({status: null})

})))