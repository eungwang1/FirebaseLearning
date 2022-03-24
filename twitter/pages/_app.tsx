import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import router from "next/router";
import { authService } from "@src/fbase";
import { onAuthStateChanged, User } from "firebase/auth";
import Navigation from "@src/components/Navigation";
import axios from "axios";

function MyApp({ Component, pageProps }: AppProps) {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<User | null>(null);
  // setInterval(() => {
  //   console.log(authService.currentUser);
  // }, 2000);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        router.push("/Home");
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        router.push("/Auth");
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      <Navigation />
      {init ? <Component {...pageProps} userObj={userObj} /> : <div>initializing...</div>}
    </>
  );
}

export default MyApp;
