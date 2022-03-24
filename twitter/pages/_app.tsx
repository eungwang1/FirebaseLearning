import React, { useEffect, useState } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import router from "next/router";
import { authService } from "@src/fbase";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import Navigation from "@src/components/Navigation";
import { IuserObj } from "@src/types/allTypes";

function MyApp({ Component, pageProps }: AppProps) {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<IuserObj | null>(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        router.push("/Home");
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(user, args),
        } as IuserObj);
      } else {
        router.push("/Auth");
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    if (user) {
      setUserObj({
        displayName: user.displayName,
        uid: user.uid,
      } as User);
    }
  };
  return (
    <>
      <Navigation userObj={userObj} />
      <div
        style={{
          maxWidth: "890px",
          width: "100%",
          margin: "0 auto",
          marginTop: "80px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {init ? (
          <Component {...pageProps} userObj={userObj} refreshUser={refreshUser} />
        ) : (
          <div>initializing...</div>
        )}
      </div>
    </>
  );
}

export default MyApp;
