import Tweet from "@src/components/Tweet";
import { dbService, storageService } from "@src/fbase";
import { Itweet } from "@src/types/allTypes";
import { User } from "firebase/auth";
import { v4 as uuid } from "uuid";
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
import { getDownloadURL, ref, updateMetadata, uploadString } from "firebase/storage";
import React, { FormEvent, useEffect, useState } from "react";
import { finished } from "stream";
import { runInNewContext } from "vm";

type Props = {};
interface CustomHTMLInputElement extends HTMLInputElement {
  result: string;
}

const Home = ({ userObj }: { userObj: null | User }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState<DocumentData[] | Itweet[]>([]);
  const [attachment, setAttachment] = useState("");
  const tweetsCollectionRef = collection(dbService, "tweets");

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
    let attachmentUrl = "";
    if (attachment) {
      const attachmentRef = ref(storageService, `${userObj?.uid}/${uuid()}`);
      const response = await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorid: userObj?.uid,
      attachmentUrl,
    };
    await addDoc(tweetsCollectionRef, tweetObj);

    setTweet("");
    setAttachment("");
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = event.target.files;
    const reader = new FileReader();
    let theFile: File;
    if (files !== null) {
      theFile = files[0];
      reader.onloadend = (finishedEvent) => {
        const result = (finishedEvent.currentTarget as CustomHTMLInputElement).result;
        setAttachment(result);
      };
      reader.readAsDataURL(theFile);
      console.log(theFile);
    }
  };
  const onClearAttachment = () => setAttachment("");

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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="tweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment} type="button">
              Clear
            </button>
          </div>
        )}
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
