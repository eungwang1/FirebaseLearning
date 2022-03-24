import { GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from "@firebase/auth";
import { authService } from "@src/fbase";
import AuthForm from "./AuthForm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

type Props = {};

const Auth = (props: Props) => {
  const onSocialClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.target as HTMLButtonElement;
    if (name === "google") {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(authService, provider);
    } else if (name === "github") {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(authService, provider);
    }
  };
  return (
    <div className="authContainer">
      <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="3x" style={{ marginBottom: 30 }} />
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};
export default Auth;
