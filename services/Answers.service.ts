import axios from "axios"
import { AnswerBody } from "types/type"


axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

export const AnswerService = {
    async getAll(){
        const response = await fetch(`${axios.defaults.baseURL}api/answers`, {
            headers: {
                'Accept': 'application/json',
            }
        } )
        return await response.json()
    },
    async delete(id:number){
        return axios.post(`api/answers/${id}`, {
            _method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async addAnswer(data:AnswerBody){
        return axios.post(`api/answers`, data, {
            headers: {
                'Accept': 'application/json'
            }
        })
    }
}