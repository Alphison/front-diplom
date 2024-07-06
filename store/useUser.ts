import { UsersService } from './../services/Users.service';
import { User } from './useSign';
import { immer } from 'zustand/middleware/immer'
import { create } from "zustand";

export interface UsersType {
    users: User[];
    loading: boolean;
    fetchUsers: () => void;
    fetchUserDelete: (id:number) => void;
    fetchUserUpdate: (id:number, role:string) => void;
    error: string | null;
    deleteUser: (id:number) => void;
    updateUser: (id:number, role:string) => void;
}

export const useUsers = create<UsersType>()(immer(set => ({
    users: [],
    loading: false,
    error: null,
    fetchUsers: async () => {
        set({loading: true})

        try {
            const res = await UsersService.getAll()

            set({users: res.data})
        } catch(error: any) {
            // set({error: error})
        } finally {
            set({loading: false})
        }
    },
    fetchUserDelete: async (id:number) => {
        set({loading: true})
        try {
            await UsersService.delete(id)
        } catch(error: any) {
            set({error: error.response.data})
        } finally {
            set({loading: false})
        }
    },
    fetchUserUpdate: async (id:number, role:string) => {
        set({loading: true})
        try {
            await UsersService.update(id, role)
        } catch(error: any) {
            set({error: error.response.data})
        } finally {
            set({loading: false})
        }
    },
    deleteUser: (id:number) => {
        set((state) => {state.users = state.users.filter(item  => item.id !== id)})
    },
    updateUser: (id:number, role:string) => {
        set((state) => {
            return {users: state.users.map(item => item.id === id ? {...item, role: role} : item)}
        })
    }
})))