import Link from "next/link";
import React from "react";

type Props = {};

const Navigation = (props: Props) => {
  return (
    <div>
      <ul>
        <li>
          <Link href="/Home">Home</Link>
        </li>
        <li>
          <Link href="/Profile">My Profile</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
