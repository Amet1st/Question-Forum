import {Post} from '../interfaces/post.interface';
import {User} from '../interfaces/user.interface';

export type ResponsePost = Record<string, Post>
export type ResponseUser = Record<string, User>
export type ResponseComments = Record<string, Comment>
