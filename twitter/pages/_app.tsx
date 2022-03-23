import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import router from "next/router";
import { authService } from "@src/fbase";
import { onAuthStateChanged } from "firebase/auth";

function MyApp({ Component, pageProps }: AppProps) {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // setInterval(() => {
  //   console.log(authService.currentUser);
  // }, 2000);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        router.push("/Home");
        setIsLoggedIn(true);
      } else {
        router.push("/Auth");
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <Component {...pageProps} /> : <div>initializing...</div>}
      <footer>&copy; {new Date().getFullYear()} Twitter</footer>
    </>
  );
}

export default MyApp;
