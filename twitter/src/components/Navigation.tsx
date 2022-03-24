import { IuserObj } from "@src/types/allTypes";
import { User } from "firebase/auth";
import Link from "next/link";
import React from "react";

type Props = {};

const Navigation = ({ userObj }: { userObj: null | IuserObj }) => {
  console.log(userObj?.displayName);
  return (
    <div>
      <ul>
        <li>
          <Link href="/Home">Home</Link>
        </li>
        {userObj && (
          <li>
            <Link href="/Profile">{`${userObj.displayName}'s profile`}</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
