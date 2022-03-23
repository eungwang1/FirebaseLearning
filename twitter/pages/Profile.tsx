import { authService } from "@src/fbase";
import React from "react";

type Props = {};

const Profile = (props: Props) => {
  const onLogOutClick = () => authService.signOut();
  return (
    <div>
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  );
};

export default Profile;
