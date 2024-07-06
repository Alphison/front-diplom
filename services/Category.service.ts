import { CategoryType } from './../types/type';
import axios from "axios"

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

interface AxiosCategories {
    data: CategoryType[] | undefined
}

interface AxiosCategory {
    data: CategoryType | undefined
}

export const CategoryService = {
    async getAll(){
        return axios.get<AxiosCategories>('api/category', {
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async getId(id:string){
        return axios.get<AxiosCategory>(`api/category/${id}`, {
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async addCat(data:CategoryType){
        return axios.post<CategoryType>(`api/category`, data, {
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    async delete(id:number){
        return axios.post(`api/category/${id}`, {
            _method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        })
    },
}