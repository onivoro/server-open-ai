import { OpenAiData } from "./open-ai-data.class";

export class OpenAiAnswer {
  id: string;
  question: string;
  answer: string;
  relevantInput: OpenAiData[];
}
