import { LessonUserBody } from "types/type";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { LessonUserService } from "services/LessonUser.service";
import produce from "immer";
import zukeeper from 'zukeeper'

type LessonUserType = {
    lesson_user: LessonUserBody[] | undefined,
    loading: boolean,
    error: string | null,
    message: string | null,
    fetchLessonUser: () => void,
    fetchAddLessonUser: (data: LessonUserBody) => void,
    status: number | null,
    setStatus: () => void,
    addLessonUser: (data: LessonUserBody) => void,
}

export const useLessonUser = create<LessonUserType>()(immer(set => ({
    lesson_user: [],
    loading: false,
    error: null,
    message: null,
    status: null,
    fetchLessonUser: async () => {
        set({ loading: true });

        try {
            const res = await LessonUserService.getAll()

            set({
                lesson_user: res.data,
            })

        } catch(error: any) {
            set({error: error.response.data.errors})

        } finally {
            set({loading: false})
        }
    },
    fetchAddLessonUser: async (data) => {
        set({ loading: true });

        try {
            const res = await LessonUserService.addLessonUser(data)

            set({status: res.status})

        } catch(error: any) {
            set({error: error.response.data.errors})

        } finally {
            set({loading: false})
        }
    },
    addLessonUser: (data) => set(state => {
        state.lesson_user?.push({lesson_id: data.lesson_id, user_id: data.user_id})
    }),
    setStatus: () => set({status: null})
})))