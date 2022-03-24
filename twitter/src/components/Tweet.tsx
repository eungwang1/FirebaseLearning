import { dbService, storageService } from "@src/fbase";
import { Itweet } from "@src/types/allTypes";
import { deleteDoc, doc, DocumentData, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
      await deleteObject(ref(storageService, tweetObj.attachmentUrl));
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
    <div className="nweet">
      <div key={tweetObj.id}>
        {editing ? (
          <>
            <form className="container nweetEdit">
              <input
                name="newTweet"
                value={newTweet}
                onChange={onChange}
                className="formInput"
                required
              />
            </form>
            <span onClick={toggleEditing} className="formBtn cancelBtn">
              Cancel
            </span>
            <span onClick={onEditClick} className="formBtn">
              Edit
            </span>
          </>
        ) : (
          <>
            <h4>{tweetObj.text}</h4>
            {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} alt="" />}
            {isOwner && (
              <div className="nweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tweet;
