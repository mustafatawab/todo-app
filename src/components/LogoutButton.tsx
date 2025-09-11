'use client'
import React from 'react'
import { Button } from './ui/button'
import { signOut } from '@/action/auth-action'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const LogoutButton = () => {
    const router = useRouter()
    const logout = async () =>{
        const res = await signOut()
        toast.success("Logged out Successfully")
        router.push('/login')
    }   
  return (
    <div>
        <Button onClick={logout} variant={"destructive"}>Logout</Button>
    </div>
  )
}

export default LogoutButton