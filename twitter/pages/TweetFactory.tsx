import { dbService, storageService } from "@src/fbase";
import { User } from "firebase/auth";
import { addDoc, collection, CollectionReference, DocumentData } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { FormEvent, useState } from "react";
import { v4 as uuid } from "uuid";

interface CustomHTMLInputElement extends HTMLInputElement {
  result: string;
}
interface Props {
  userObj: User | null;
  tweetsCollectionRef: CollectionReference<DocumentData>;
}

const TweetFactory = ({ userObj, tweetsCollectionRef }: Props) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");
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
    </form>
  );
};

export default TweetFactory;
