// https://platform.openai.com/docs/models

export class ServerOpenAiConfig {

    constructor(
        public apiKey: string,
        public organization = '',
        public EMBEDDING_MODEL: 'text-embedding-ada-002' |  'text-embedding-3-large' | 'text-embedding-3-small'= 'text-embedding-ada-002',
        public GPT_MODEL: 'gpt-4' | 'gpt-4-turbo-preview' | 'gpt-3.5-turbo' = 'gpt-4',
        public IMAGE_MODEL: 'dall-e-2' = 'dall-e-2',
        public introduction = 'Use the information available to answer the subsequent question. If the answer cannot be found in the articles, write "I could not find an answer."',
        public maxTokensPerTextChunk = 1000,
        public sentenceDeliminator = '. ',
        public tokenRatio = 0.75,
        public maxQuestionInput = 6,
        public temperature = 0,
    ) {}
}