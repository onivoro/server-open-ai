import { join } from 'node:path';

import { Configuration, OpenAIApi } from 'openai';
import { ServerOpenAiConfig } from '../classes/server-open-ai-config.class';
import { OpenAiService } from './open-ai.service';
import { extractText } from '../functions/extract-text.function';
import { loadDotEnv } from '@onivoro/server-parameterization';
import { OpenAiData } from '../classes/open-ai-data.class';

describe(OpenAiService.name, () => {
  const setup = () => {
    loadDotEnv();

    const apiKey = process.env['OPENAI_KEY'];
    const org = process.env['OPENAI_ORG'];

    const config = new ServerOpenAiConfig(apiKey, org);
    const openai = new OpenAIApi(new Configuration({ apiKey }));

    const subject = new OpenAiService(config as ServerOpenAiConfig, openai as OpenAIApi);

    return { config, openai, subject }
  };

  describe(OpenAiService.prototype.tokenizeTextAndPersistAsEmbedding.name, () => {
    it.each([
      'swan-shower-base-install-guide.pdf',
    ])('tokenizes text and calls OpenAi to generate embeddings before passing the embedding and text to the persister', async (assetPath: string) => {
      const { subject } = setup();
      const contents = await extractText(join(process.cwd(), `libs/server-open-ai/src/lib/assets/${assetPath}`));

      console.log(contents);

      const persister = jest.fn().mockResolvedValue('jest requires an argument here :(');

      await subject.tokenizeTextAndPersistAsEmbedding(contents, persister);

      const output: OpenAiData[] = persister.mock.calls.map(([args]) => args[0]);
      expect(output.every(o => (o.embedding?.length || 0) > 0)).toBe(true);
      expect(output.map(o => o.text)).toMatchSnapshot();
    }, 60_000);
  });

  describe(OpenAiService.prototype.destructureFileAndPersistSegments.name, () => {
    it.each([
      'so.txt',
    ])('tokenizes text and calls OpenAi to generate embeddings before passing the embedding and text to the persister', async (assetPath: string) => {
      const { subject } = setup();
      const contents = await extractText(join(process.cwd(), `libs/server-open-ai/src/lib/assets/${assetPath}`));

      console.log(contents);

      const persister = jest.fn().mockResolvedValue('jest requires an argument here :(');

      await subject.destructureFileAndPersistSegments(subject.synthesizeFileObject(
        assetPath,
        contents
      ), persister);

      const output: OpenAiData[] = persister.mock.calls.map(([args]) => args[0]);
      expect(output.map(o => o.text)).toMatchSnapshot();
    }, 60_000);
  });
});
