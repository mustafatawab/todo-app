// components/LoginButton.tsx
"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

const LoginButton = ({text , provider} : {text : string, provider : string}) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div>
        Signed in as **{session.user?.name || session.user?.email}** <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }

  return (
    <div>
      <Button onClick={() => signIn(provider , {callbackUrl : '/'})}>{text}</Button>
    </div>
  );
};

export default LoginButton;
