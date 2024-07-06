import { CourseDataType } from 'store/useCourse';
import { CourseType } from './../types/type';
import axios from "axios"


axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

export type dataCourseType = {
    id?: number,
    active: string
}

export const CourseService = {
    async getAll(){
        const response = await fetch(`${axios.defaults.baseURL}api/courses`, {
            headers: {
                'Accept': 'application/json',
            }
        } )
        return await response.json()
    },
    async getId(id:number){
        return axios.get<CourseDataType>(`api/courses/${id}`, {
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async delete(id:number){
        return axios.post(`api/courses/${id}`, {
            _method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async update(data:CourseType, id:number){
        return axios.post(`api/courses/${id}`, data, {
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async updateCourseActive(dataCourse:dataCourseType){
        return axios.post('api/course_update', dataCourse, {
            headers: {
                'Accept': 'application/json'
            }
        })
    }
}