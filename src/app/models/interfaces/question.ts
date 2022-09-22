export interface Question {
  title: string;
  text: string;
  date?: Date;
  tags?: Array<string>;
}