'use server'
import {auth} from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from "@prisma/client"

export const register = async (name: string , email : string , password : string) => {

    let response = await auth.api.signUpEmail({
        body : {
            name,
            email,
            password,
            callbackURL : '/'
        }
    })
    
    return response
}


export const login = async (email : string , password : string) => {

    const response = await auth.api.signInEmail({
        body : {
            email,
            password,
            callbackURL : '/'
        }
    })

    return response
}


export const signOut = async () => {
    const response = await auth.api.signOut({headers : await headers()})
    return response
}


export const socialLogin = async (provider : "github" | "google") => {
    const { url } = await auth.api.signInSocial({
        body : {
            provider,
            callbackURL : '/'
        }

    })

    if (url){
        redirect(url)
    }
    
}
