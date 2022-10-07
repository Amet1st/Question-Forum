import {Comment} from "./comment.inteface";

export interface Post {
  id: string;
  author: string;
  authorId: string;
  title: string;
  text: string;
  date: Date;
  tags: string[];
  comments: Comment[];
  isApproved: boolean;
  isSolved: boolean;
}
