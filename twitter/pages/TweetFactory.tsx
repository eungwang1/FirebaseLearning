import { storageService } from "@src/fbase";
import { User } from "firebase/auth";
import { addDoc, CollectionReference, DocumentData } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { FormEvent, useState } from "react";
import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

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
    if (tweet === "") {
      return;
    }
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
    }
  };
  const onClearAttachment = () => setAttachment("");
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input
          type="submit"
          value="&rarr;"
          className="factoryInput__arrow"
          style={{ cursor: "pointer" }}
        />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />

      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
