import axios from "axios"
import { CourseUserBody } from "types/type"


axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

// interface AxiosLessons {
//     data: LessonType[] | undefined
// }



export const CourseUserService = {
    async getAll(){
        return axios.get(`api/course_user`, {
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async addCourseUser(data:CourseUserBody){
        return axios.post(`api/course_user`, data, {
            headers: {
                'Accept': 'application/json'
            }
        })
    }
}