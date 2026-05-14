'use server'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


async function getSession() {
    const session = await  auth.api.getSession({headers : await headers()})
    return session
}



export  async function getTasks(){
    const session = await getSession()
    try {
        const res = await fetch(`/api/task?userId=${session?.user.id}`)
        const data = await res.json()
        return data.tasks
    } catch (error) {
        return error
    }
}


export async function addTask(title : string, description: string) {
    const session = await getSession()
    try {
        const res = await fetch("/api/task" , {
            method : "POST",
            body : JSON.stringify({
                userId : session?.user.id,
                title : title,
                description: description
            })
        })

        const data =  await res.json()
        return data
    } catch (error) {
        return error
    }
}

