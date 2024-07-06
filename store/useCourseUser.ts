import { CourseUserBody } from "types/type";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { CourseUserService } from "services/CourseUser.service";

type CourseUserType = {
    course_user: CourseUserBody[] | undefined,
    loading: boolean,
    error: string | null,
    message: string | null,
    fetchCourseUser: () => void,
    fetchAddCourseUser: (data: CourseUserBody) => void,
    status: number | null,
    setStatus: () => void,
    addCourseUser: (data: CourseUserBody) => void,
}

export const useCourseUser = create<CourseUserType>()(immer(set => ({
    course_user: [],
    loading: false,
    error: null,
    message: null,
    status: null,
    fetchCourseUser: async () => {
        set({ loading: true });

        try {
            const res = await CourseUserService.getAll()

            set({
                course_user: res.data,
            })

        } catch(error: any) {
            set({error: error.response.data.errors})

        } finally {
            set({loading: false})
        }
    },
    fetchAddCourseUser: async (data) => {
        set({ loading: true });

        try {
            const res = await CourseUserService.addCourseUser(data)

            set({status: res.status})

        } catch(error: any) {
            set({error: error.response.data.errors})

        } finally {
            set({loading: false})
        }
    },
    addCourseUser: (data) => set(state => {
        state.course_user?.push({course_id: data.course_id, user_id: data.user_id})
    }),
    setStatus: () => set({status: null})
})))