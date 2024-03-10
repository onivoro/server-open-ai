import { join } from 'node:path';

import OpenAIApi from 'openai';
import { ServerOpenAiConfig } from '../classes/server-open-ai-config.class';
import { OpenAiService } from './open-ai.service';
import { extractText } from '../functions/extract-text.function';
import { loadDotEnv } from '@onivoro/server-parameterization';
import { OpenAiData } from '../classes/open-ai-data.class';

const testAssetDirectory = 'test';

describe(OpenAiService.name, () => {
  const setup = () => {
    loadDotEnv();

    const apiKey = process.env['OPENAI_KEY'] as string;
    const org = process.env['OPENAI_ORG'] as string;

    const config = new ServerOpenAiConfig(apiKey, org);
    const openai = new OpenAIApi({ apiKey });

    const subject = new OpenAiService(config as ServerOpenAiConfig, openai as OpenAIApi);

    return { config, openai, subject }
  };

  describe(OpenAiService.prototype.genEmbeddings.name, () => {
    it('worx', async () => {
      const { subject } = setup();
      const embeddingResult = await subject.genEmbeddings(['tokenizes text and calls OpenAi to generate embeddings before passing the embedding and text to the persister']);
      const num = embeddingResult[0].embedding[0];
      expect(Math.abs(num) < 1).toBe(true);
    });
  });

  describe(OpenAiService.prototype.tokenizeTextAndPersistAsEmbedding.name, () => {
    it.each([
      'swan-shower-base-install-guide.pdf',
    ])('tokenizes text and calls OpenAi to generate embeddings before passing the embedding and text to the persister', async (assetPath: string) => {
      const { subject } = setup();
      const contents = await extractText(join(process.cwd(), `${testAssetDirectory}/${assetPath}`));

      const output: OpenAiData[] = [];

      await subject.tokenizeTextAndPersistAsEmbedding(contents, async (data: OpenAiData[]) => {
        output.push(data[0]);
      });

      expect(output.every(o => (o.embedding?.length || 0) > 0)).toBe(true);
      expect(output.map(o => o.text)).toMatchSnapshot();
    }, 60_000);
  });

  describe(OpenAiService.prototype.destructureFileAndPersistSegments.name, () => {
    it.each([
      'so.txt',
    ])('tokenizes text and calls OpenAi to generate embeddings before passing the embedding and text to the persister', async (assetPath: string) => {
      const { subject } = setup();
      const contents = await extractText(join(process.cwd(), `${testAssetDirectory}/${assetPath}`));

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
