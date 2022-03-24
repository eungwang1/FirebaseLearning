import { User } from "firebase/auth";

export interface Itweet {
  id: string;
  createdAt: number;
  text: string;
  creatorid: string;
  attachmentUrl: string;
}

export type PUser = Pick<User, "displayName" | "uid">;

export interface IuserObj extends User {
  updateProfile?: (args: User) => Promise<void>;
}
