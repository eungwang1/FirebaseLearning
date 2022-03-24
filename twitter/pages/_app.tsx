import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import router from "next/router";
import { authService } from "@src/fbase";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import Navigation from "@src/components/Navigation";
import axios from "axios";
import { IuserObj } from "@src/types/allTypes";

function MyApp({ Component, pageProps }: AppProps) {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<IuserObj | null>(null);
  // setInterval(() => {
  //   console.log(authService.currentUser);
  // }, 2000);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        router.push("/Home");
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(user, args),
        } as IuserObj);
      } else {
        router.push("/Auth");
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    user &&
      setUserObj({
        displayName: user.displayName,
        uid: user.uid,
      } as User);
  };
  return (
    <>
      <Navigation userObj={userObj} />
      {init ? (
        <Component {...pageProps} userObj={userObj} refreshUser={refreshUser} />
      ) : (
        <div>initializing...</div>
      )}
    </>
  );
}

export default MyApp;
