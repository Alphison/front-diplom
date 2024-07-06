import axios from "axios"
import { LessonDataType } from "store/useLesson"
import { LessonType } from "types/type"


axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

interface AxiosLessons {
    data: LessonType[] | undefined
}



export const LessonService = {
    async getAll(){
        return axios.get(`api/lessons`, {
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async getId(id:number){
        return axios.get<LessonDataType>(`api/lessons/${id}`, {
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async delete(id:number){
        return axios.post(`api/lessons/${id}`, {
            _method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    // async update(data:CourseType, id:number){
    //     return axios.post(`api/courses/${id}`, {
    //         _method: 'PUT',
    //         headers: {
    //             'Accept': 'application/json'
    //         }
    //     })
    // },
}