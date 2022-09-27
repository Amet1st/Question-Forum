export interface Question {
  id: string;
  author: string;
  title: string;
  text: string;
  date: Date;
  tags: string[];
}