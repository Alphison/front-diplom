import axios from "axios"


axios.defaults.baseURL = process.env.NEXT_PUBLIC_API


export const UsersService = {
    async getAll(){
        return axios.get(`api/users`, {
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async delete(id:number){
        return axios.post(`api/users/${id}`, {
            _method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async update(id:number, role:string){
        return axios.post(`api/users/${id}`, {
            _method: 'PUT',
            role: role
        })
    },
}