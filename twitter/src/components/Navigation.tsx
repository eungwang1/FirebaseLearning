import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IuserObj } from "@src/types/allTypes";
import Link from "next/link";
import React from "react";

const Navigation = ({ userObj }: { userObj: null | IuserObj }) => {
  return (
    <div>
      <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <li>
          <Link href="/Home">
            <span style={{ marginRight: 10 }}>
              <FontAwesomeIcon
                icon={faTwitter}
                color={"#04AAFF"}
                size="2x"
                style={{ cursor: "pointer" }}
              />
            </span>
          </Link>
        </li>
        {userObj && (
          <li>
            <Link href="/Profile">
              <span
                style={{
                  marginLeft: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  fontSize: 12,
                }}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  color={"#04AAFF"}
                  size="2x"
                  style={{ cursor: "pointer" }}
                />
                <span style={{ marginTop: 10 }}>
                  {userObj.displayName ? `${userObj.displayName}'s Profile` : "Profile"}
                </span>
              </span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
