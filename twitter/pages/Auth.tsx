import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
} from "@firebase/auth";
import { authService } from "@src/fbase";
import React, { DetailedHTMLProps, FormEventHandler, InputHTMLAttributes, useState } from "react";

type Props = {};

const Auth = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (newAccount) {
        const data = await createUserWithEmailAndPassword(authService, email, password);
        console.log(data);
        // createAccount
      } else {
        const data = await signInWithEmailAndPassword(authService, email, password);
        console.log(data);
        // login
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setError(error.message);
      }
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.target as HTMLButtonElement;
    if (name === "google") {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(authService, provider);
      console.log(result);
    } else if (name === "github") {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(authService, provider);
      console.log(result);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        {error}
      </form>
      <span onClick={toggleAccount}>{newAccount ? "Sign In" : " Create Accout"}</span>
      <div>
        <button type="button" onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button type="button" onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
    </div>
  );
};
export default Auth;
