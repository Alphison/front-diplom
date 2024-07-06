import { BodyRegister, BodyLogin } from './../services/Sign.service';
import { Sign } from "services/Sign.service";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { BodyUser, User } from 'services/User.service';

type Register = {
    user: BodyRegister | null,
    loading: boolean,
    error: string | null,
    message: string | null,
    fetchRegister: (body:BodyRegister) => void,
    status: number | null,
    setStatus: () => void,
}

export const useRegister = create<Register>()(immer(set => ({
    user: null,
    loading: false,
    error: null,
    message: null,
    status: null,
    fetchRegister: async (body) => {
        set({ loading: true });

        try {
            const res = await Sign.register(body)

            set({
                user: res.data.user,
                message: res.data.message,
                status: res.status
            })

        } catch(error: any) {
            set({error: error.response.data.errors.email})

        } finally {
            set({loading: false})
        }
    },
    setStatus: () => set({status: null})
})))

export type User = {
    id:number,
    name: string,
    surname: string,
    patronymic: string,
    email:string,
    password: string,
    role: string,
    ava: string | null,
}

type login = {
    user: User | null,
    access_token: string | null,
    token_type: string | null,
    loading: boolean,
    error: null | any,
    message: string | null,
    fetchLogin: (body:BodyLogin) => void,
    fetchUser: (token:string | null) => void,
    getToken: () => void,
    fetchUpdateAvatar: ({access_token, data}:BodyUser) => void,
    fetchUpdateProfile: ({access_token, data}:BodyUser) => void,
    fetchUpdateRole: ({access_token, data}:BodyUser) => void,
    status: number | null,
    setStatus: () => void,
}

export const uselogin = create<login>()(immer(set => ({
    user: null,
    access_token: null,
    token_type: null,
    loading: false,
    error: null,
    message: null,
    status: null,
    fetchLogin: async (body) => {
        set({ loading: true });

        try {
            const res = await Sign.login(body)
            set({status: res.status})

            set({
                user: res.data.user,
                access_token: res.data.access_token,
                token_type: res.data.token_type,
                message: res.data.message,
            })

            sessionStorage.setItem('access_token', JSON.stringify(res.data.access_token))

            
        } catch(error: any) {
            set({error: error.response.data.errors})
        } finally {
            set({loading: false})
        }
    },
    fetchUser: async (token) => {
        set({loading: true})
        try {
            const res = await User.user(token)

            set({user: res})
            
        } catch(error: any) {
            // set({error: error.response.data.errors})

        } finally {
            set({loading: false})
        }
    },
    fetchLogout: async () => {
        set({loading: true})
        try {
            const res = await Sign.logout()
        }catch(error) {
            set({
                user: null,
                access_token: null,
                token_type: null,
                message: null,
            })

            sessionStorage.clear()
            
        }finally{
            set({loading: false})
        }
    },
    fetchUpdateAvatar: async ({access_token, data}) => {
        set({loading: true})
        try {
            const res = await User.updateAva({access_token, data})

            set({user: res.user})
            
            set({error: res.errors})
            
        } catch(error: any) {
            // set({error: error})

        } finally {
            set({loading: false})
        }
    },
    fetchUpdateProfile: async ({access_token, data}) => {
        set({loading: true})
        try {
            const res = await User.updateProfile({access_token, data})

            set({user: res.user})

            set({error: res.errors})
            
        } catch(error: any) {
            // set({error: error})

        } finally {
            set({loading: false})
        }
    },
    fetchUpdateRole: async ({access_token, data}) => {
        set({loading: true})
        try {
            const res = await User.updateRole({access_token, data})

            set({user: res.user})

            set({error: res.errors})
            
        } catch(error: any) {
            // set({error: error})

        } finally {
            set({loading: false})
        }
    },
    getToken: () => set({access_token: JSON.parse(sessionStorage.getItem('access_token')!)}),
    setStatus: () => set({status: null})
})))