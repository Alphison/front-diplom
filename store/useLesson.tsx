import { immer } from 'zustand/middleware/immer'
import { create } from "zustand";
import {LessonType} from "../types/type"
import { LessonService } from 'services/Lesson.service';

export type LessonDataType = {
    data: LessonType
}

type StateLesson = {
    lesson: LessonDataType | undefined;
    loading: boolean;
    error: string | null;
    fetchLesson: (id:number) => void
}

export const useLesson = create<StateLesson>()(immer(set => ({
    lesson: undefined,
    loading: false,
    error: null,
    fetchLesson: async (id) => {
        set({loading: true})

        try {
            const res = await LessonService.getId(id)

            set({lesson: res.data})
        } catch(error: any) {
            set({error: error})
        } finally {
            set({loading: false})
        }
    }
})))