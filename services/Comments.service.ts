import axios from "axios"
import { CommentBody } from "types/type"


axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

export const CommentService = {
    async getAll(){
        const response = await fetch(`${axios.defaults.baseURL}api/comments`, {
            headers: {
                'Accept': 'application/json',
            }
        } )
        return await response.json()
    },
    async addComment(data:CommentBody){
        return axios.post(`api/comments`, data, {
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async delete(id:number){
        return axios.post(`api/comments/${id}`, {
            _method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        })
    },
}