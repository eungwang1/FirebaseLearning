import Tweet from "@src/components/Tweet";
import { dbService } from "@src/fbase";
import { Itweet } from "@src/types/allTypes";
import { User } from "firebase/auth";
import { collection, DocumentData, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import TweetFactory from "./TweetFactory";

const Home = ({ userObj }: { userObj: null | User }) => {
  const tweetsCollectionRef = collection(dbService, "tweets");
  const [tweets, setTweets] = useState<DocumentData[] | Itweet[]>([]);

  useEffect(() => {
    onSnapshot(tweetsCollectionRef, (snapshot) => {
      const tweetsArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetsArr);
    });
  }, []);

  return (
    <div>
      <TweetFactory userObj={userObj} tweetsCollectionRef={tweetsCollectionRef} />
      <div>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorid === userObj?.uid} />
        ))}
      </div>
    </div>
  );
};

export default Home;
