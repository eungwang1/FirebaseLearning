import { dbService } from "@src/fbase";
import { Itweet } from "@src/types/allTypes";
import { deleteDoc, doc, DocumentData, updateDoc } from "firebase/firestore";
import React, { useState } from "react";

interface ITweet {
  tweetObj: Itweet | DocumentData;
  isOwner: boolean;
}

const Tweet = ({ tweetObj, isOwner }: ITweet) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const toggleEditing = () => setEditing((prev) => !prev);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };
  const onDeleteClick = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");

    if (ok) {
      await deleteDoc(doc(dbService, `tweets/${tweetObj.id}`));
    }
  };
  const onEditClick = async () => {
    const ok = window.confirm("수정하시겠습니까?");
    if (ok) {
      await updateDoc(doc(dbService, `tweets/${tweetObj.id}`), { text: newTweet });
      setEditing(false);
    }
  };
  return (
    <div>
      <div key={tweetObj.id}>
        {editing ? (
          <>
            <form>
              <input name="newTweet" value={newTweet} onChange={onChange} required />
            </form>
            <button type="button" onClick={toggleEditing}>
              Cancel
            </button>
            <button type="button" onClick={onEditClick}>
              Edit
            </button>
          </>
        ) : (
          <>
            <h4>{tweetObj.text}</h4>
            {isOwner && (
              <>
                <button type="button" onClick={onDeleteClick}>
                  Delete Tweet
                </button>
                <button type="button" onClick={toggleEditing}>
                  Edit Twwet
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tweet;
