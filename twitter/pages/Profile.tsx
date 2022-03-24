import { authService, dbService } from "@src/fbase";
import { updateProfile, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import router from "next/router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { async } from "@firebase/util";

type Props = {};

const Profile = ({ userObj, refreshUser }: { userObj: null | User; refreshUser: () => void }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj?.displayName);
  useEffect(() => {
    getMyTweets();
  }, []);
  const onLogOutClick = () => {
    authService.signOut();
  };
  const getMyTweets = async () => {
    const tweetsRef = collection(dbService, "tweets");
    if (userObj) {
      const tweetsQuery = query(
        tweetsRef,
        where("creatorid", "==", userObj?.uid),
        orderBy("createdAt"),
      );
      const tweetsQuerySnapshot = await getDocs(tweetsQuery);
      tweetsQuerySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    }
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userObj && userObj.displayName !== newDisplayName) {
      const user = authService.currentUser;
      user &&
        (await updateProfile(user, {
          displayName: newDisplayName,
        }));

      refreshUser();
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name"
          onChange={onChange}
          value={newDisplayName as string}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  );
};

export default Profile;
