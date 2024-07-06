import { immer } from 'zustand/middleware/immer'
import { create } from "zustand";
import { CourseService } from 'services/Courses.service';
import {CourseType} from "../types/type"

export type CourseDataType = {
    data: CourseType
}

type StateCourses = {
    course: CourseDataType | undefined;
    loading: boolean;
    error: string | null;
    fetchCourse: (id:number) => void
}

export const useCourse = create<StateCourses>()(immer(set => ({
    course: undefined,
    loading: false,
    error: null,
    fetchCourse: async (id) => {
        set({loading: true})

        try {
            const res = await CourseService.getId(id)

            set({course: res.data})
        } catch(error: any) {
            set({error: error})
        } finally {
            set({loading: false})
        }
    }
})))