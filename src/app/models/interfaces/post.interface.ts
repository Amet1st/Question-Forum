import {Comment} from './comment.inteface';

export interface Post {
  id: string;
  author: string;
  authorId: string;
  title: string;
  text: string;
  isApproved: boolean;
  isSolved: boolean;
  date: Date;
  tags: string[];
  comments: Comment[];
}
