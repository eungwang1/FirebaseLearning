import { dbService } from "@src/fbase";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { FormEvent, useEffect, useState } from "react";

type Props = {};

const Home = (props: Props) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    async function getTweets() {
      // 단일문서
      // const tweetsDoc = await getDoc(doc(dbService, "tweets", "HNLsTw4uAvlihO8bO6yi"));
      // console.log(tweetsDoc.data());
      // 모든문서
      const tweetsDoc = await getDocs(collection(dbService, "tweets"));
      tweetsDoc.forEach((doc) => console.log(doc.data()));
    }
    getTweets();
  }, []);
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const tweetsCollectionRef = collection(dbService, "tweets");
    await addDoc(tweetsCollectionRef, { tweet, createdAt: Date.now() });
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
      </form>
    </div>
  );
};

export default Home;
