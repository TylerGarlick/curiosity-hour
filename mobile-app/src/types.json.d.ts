declare module "*.json" {
  interface QuestionJson {
    id: string;
    text?: string;
    question?: string;
    [key: string]: unknown;
  }
  const value: QuestionJson[];
  export default value;
}
