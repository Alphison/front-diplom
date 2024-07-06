import { immer } from 'zustand/middleware/immer'
import { create } from "zustand";
import { CourseService, dataCourseType } from 'services/Courses.service';
import {CourseType, CategoryType} from "../types/type"
import { CategoryService } from 'services/Category.service';
import { LessonService } from 'services/Lesson.service';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

type StateCourses = {
    courses: CourseType[] | undefined;
    loading: boolean;
    error: [string] | null;
    fetchCourses: () => void;
    fetchAddCourse: (data:CourseType) => void;
    status: number | null;
    setStatus: () => void;
    fetchCourseDelete: (id:number) => void;
    deleteCourse: (id:number) => void;
    fetchUpdateCourse: (data:CourseType, id:number,) => void;
    fetchCourseUpdateActive: (data:dataCourseType) => void;
    percent: number;
}

type StateCategory = {
    categories: CategoryType[];
    loading: boolean;
    status: number | null;
    error: string | null;
    fetchCategory: () => void;
    fetchCategoryDelete: (id:number) => void;
    setStatus: () => void;
    deleteCategory: (id:number) => void;
    fetchAddCategory: (data:CategoryType) => void;
}

export const useCourses = create<StateCourses>()(immer(set => ({
    courses: undefined,
    loading: false,
    error: null,
    status: null,
    percent: 0,
    fetchCourses: async () => {
        set({loading: true})

        try {
            const res = await CourseService.getAll()

            // if(!res.ok) throw new Error('Failed to fetch! Try again')
            set({courses: res.data})
        } catch(error: any) {
            set({error: error})
        } finally {
            set({loading: false})
        }
    },
    fetchAddCourse: async (data) => {
        set({loading: true})

        try {
            const res = await axios.post<CourseType>(`api/courses`, data, {
                onUploadProgress: (data) => {
                    set({percent: Math.round((data.loaded / data.total!) * 100)})
                },
                headers: {
                    'Accept': 'application/json'
                }
            })


            set({status: res.status})

        } catch (error:any) {
            set({error: error.response.data.errors.img_course})
        }finally{
            set({loading: false})
            // set({error: null})
        }
    },
    fetchCourseDelete: async (id:number) => {
        set({loading: true})
        try {
            await CourseService.delete(id)
        } catch(error: any) {
            set({error: error.response.data})
        } finally {
            set({loading: false})
        }
    },
    fetchUpdateCourse: async (data, id) => {
        set({loading: true})
        try {
            const res = await CourseService.update(data, id)
            set({status: res.status})
        } catch(error: any) {
            set({error: error.response.data.errors.img_course})
        } finally {
            set({loading: false})
        }
    },
    fetchCourseUpdateActive: async (data) => {
        set({loading: true})
        try {
            await CourseService.updateCourseActive(data)
        } catch(error: any) {
            set({error: error.response.data.errors})
        } finally {
            set({loading: false})
        }
    },
    deleteCourse: (id:number) => {
        set((state) => {state.courses = state.courses?.filter(item  => item.id !== id)})
    },
    setStatus: () => set({status: null})
})))

export const useCategory = create<StateCategory>()(immer(set => ({
    categories: [],
    loading: false,
    status: null,
    error: null,
    fetchCategory: async () => {
        set({loading: true})

        try {
            const res = await CategoryService.getAll()

            // if(!res.ok) throw new Error('Failed to fetch! Try again')

            set({categories: res.data.data})
        } catch(error: any) {
            set({error: error})
        } finally {
            set({loading: false})
        }
    },
    fetchAddCategory: async (data) => {
        set({loading: true})

        try {
            const res = await CategoryService.addCat(data)
            set({status: res.status})

        } catch (error:any) {
            set({error: error.response.data.errors.img_course})
        }finally{
            set({loading: false})
            // set({error: null})
        }
    },
    fetchCategoryDelete: async (id:number) => {
        set({loading: true})
        try {
            await CategoryService.delete(id)
        } catch(error: any) {
            set({error: error.response.data})
        } finally {
            set({loading: false})
        }
    },
    deleteCategory: (id:number) => {
        set((state) => {state.categories = state.categories?.filter(item  => item.id !== id)})
    },
    setStatus: () => set({status: null})
})))