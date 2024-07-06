import axios from "axios"


axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

export interface BodyRegister {
    name: string,
    email: string,
    password: string,
    surname: string,
    patronymic: string,
}

export interface BodyLogin {
    email: string,
    password: string,
}

export const Sign = {
    async register(body: BodyRegister){
        return axios.post(`api/auth/register`, 
        {email: body.email, password: body.password, surname: body.surname, name: body.name, patronymic: body.patronymic},
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    async login(body: BodyLogin){
        return axios.post(`api/auth/login`, 
        {email: body.email, password: body.password},
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    async logout(){
        return axios.post(`api/auth/logout`,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}