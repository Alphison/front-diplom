import axios from "axios"


axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

type BodyProfile = {
    name: string | undefined,
    email: string | undefined,
    surname: string | undefined,
    patronymic: string | undefined,
}

export interface BodyUser {
    access_token: string | null,
    data: string,
}

export const User = {
    async user(token:string | null){
        const response = await fetch(`${axios.defaults.baseURL}api/auth/me`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        } )
        return await response.json()
    },
    async updateAva({access_token, data}:BodyUser){
        const response = await fetch(`${axios.defaults.baseURL}api/profile/updateAvatar`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: data
        } )
        return await response.json()
    },
    async updateProfile({access_token, data}:BodyUser){
        const response = await fetch(`${axios.defaults.baseURL}api/profile/updateProfile`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: data,
        } )
        return await response.json()
    },
    async updateRole({access_token, data}:BodyUser){
        const response = await fetch(`${axios.defaults.baseURL}api/profile/updateRole`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: data,
        } )
        return await response.json()
    },
}