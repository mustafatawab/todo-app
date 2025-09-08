import {withAuth} from 'next-auth/middleware'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export default withAuth(
  function middleware(){
    return NextResponse.next()
  },
  {
    callbacks : {
      authorized : ({token ,req}) => {
        const {pathname } = req.nextUrl
        if (pathname.startsWith("/api/auth") || pathname == '/login' || pathname == "/register"){
          return true
        }

        //public
        if(pathname == "/" || pathname.startsWith("/api/")){
          return true
        }

        return !!token
      }
    }
  }
)


export const config = {
  matcher : ["/"]
}