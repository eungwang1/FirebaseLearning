import Tweet from "@src/components/Tweet";
import { dbService } from "@src/fbase";
import { Itweet } from "@src/types/allTypes";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import React, { FormEvent, useEffect, useState } from "react";
import { runInNewContext } from "vm";

type Props = {};

const Home = ({ userObj }: { userObj: null | User }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState<DocumentData[] | Itweet[]>([]);
  // console.log(userObj);
  const tweetsCollectionRef = collection(dbService, "tweets");
  const getTweets = async () => {
    // 단일문서
    // const tweetsDoc = await getDoc(doc(dbService, "tweets", "HNLsTw4uAvlihO8bO6yi"));
    // console.log(tweetsDoc.data());
    // 모든문서
    const tweetsDoc = await getDocs(collection(dbService, "tweets"));
    tweetsDoc.forEach((doc) => {
      const tweetObject = {
        ...doc.data(),
        id: doc.id,
      };
      setTweets((prev) => {
        return [tweetObject, ...prev];
      });
    });
  };
  useEffect(() => {
    onSnapshot(tweetsCollectionRef, (snapshot) => {
      const tweetsArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(tweetsArr);
      setTweets(tweetsArr);
    });
  }, []);
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await addDoc(tweetsCollectionRef, {
      text: tweet,
      createdAt: Date.now(),
      creatorid: userObj?.uid,
    });
    setTweet("");
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={tweet}
          onChange={onChange}
        />
        <input type="submit" value="tweet" />
        <div>
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorid === userObj?.uid} />
          ))}
        </div>
      </form>
    </div>
  );
};

export default Home;
