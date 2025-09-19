'use client'
import React from 'react'
import { Button } from './ui/button'
import { signOut } from '@/action/auth-action'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { LogOutIcon } from 'lucide-react'
const LogoutButton = () => {
    const router = useRouter()
    const logout = async () =>{
        const res = await signOut()
        toast.success("Logged out Successfully")
        router.push('/login')
    }   
  return (
    <div>
        <Button className='cursor-pointer' onClick={logout} variant={"destructive"}><LogOutIcon /></Button>
    </div>
  )
}

export default LogoutButton