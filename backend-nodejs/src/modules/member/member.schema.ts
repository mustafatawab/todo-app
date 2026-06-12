import { z } from 'zod'

export const createMemberSchema = z.object({
    name : z.string().min(2 , "At Least 2 characters are required"),
    username : z.string().min(2,"At Least 2 characters are required"),
    email : z.string().email().min(2, "At Least 2 characters are required"),
    password : z.string().min(2, "At Least 2 characters are required"),
})


export const updateMemberSchema = z.object({
   role : z.enum(["ADMIN" , "MEMBER"])
})


export type CreateMemberInput = z.infer<typeof createMemberSchema>
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>