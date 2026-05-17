import type { RegisterInput, LoginInput } from "./auth.schema"
import { prisma } from "../../shared/lib/prisma";
import { AppError } from "../../shared/error/AppError";
import { hashPassword, comparePassword  } from "../../shared/utils/hash";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../shared/utils/jwt";

export const userRegisteration = async (input: RegisterInput) => {

    const { name, email , password } = input;
    
    const existingUser = await prisma.user.findUnique({
        where : {
            email
        }
    })

    if (existingUser) {
        throw new AppError("User with this email already exists", 400)
    }

    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
        data : {
            name,
            email,
            password : hashedPassword
        }
    })

    return user;

}


export const userLogin = async (input: LoginInput, ipAddress: string , userAgent: string) => {
    
    
    const user = await prisma.user.findUnique({
        where : {
            email: input.email
        }
    })

    if (!user) {
        throw new AppError("Invalid email", 400)
    }

    const isPasswordValid = await comparePassword(input.password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid  password", 400)
    }


    const payload = {
        userId : user.id,
        email : user.email
    }
    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    const { password, ...userWithoutPassword } = user;

    await prisma.session.create({
        data : {
            token : refreshToken,
            userId : user.id,
            expiresAt : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            ipAddress,
            userAgent
        }
    })
    return { user: userWithoutPassword, accessToken, refreshToken };
}

