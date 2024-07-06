import axios from "axios"
import { LessonUserBody } from "types/type"

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

export const LessonUserService = {
    async getAll(){
        return axios.get(`api/lesson_user`, {
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async addLessonUser(data:LessonUserBody){
        return axios.post(`api/lesson_user`, data, {
            headers: {
                'Accept': 'application/json'
            }
        })
    }
}