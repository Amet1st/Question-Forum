export interface User {
    id?: string;
    email: string;
    isAdmin: boolean;
    dateOfSignUp: Date;
    posts: number;
}