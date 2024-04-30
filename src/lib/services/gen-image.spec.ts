import OpenAIApi from 'openai';
import { ServerOpenAiConfig } from '../classes/server-open-ai-config.class';
import { OpenAiService } from './open-ai.service';
import { loadDotEnv } from '@onivoro/server-parameterization';
import { writeFile } from 'fs/promises';

describe('gen-image', () => {
  const setup = () => {
    loadDotEnv();
    const apiKey = process.env['OPENAI_KEY'] as string;
    const config = new ServerOpenAiConfig(apiKey, undefined, 'text-embedding-ada-002', 'gpt-4-turbo-preview', 'dall-e-2');
    const openai = new OpenAIApi({ apiKey });
    const subject = new OpenAiService(config as ServerOpenAiConfig, openai as OpenAIApi);

    return { config, openai, subject }
  };

  describe(OpenAiService.prototype.genImage.name, () => {
    it('worx', async () => {
      const { subject } = setup();
      let prompt = 'a high definition scenescape of an Oklahoma sunset';

      const response = await subject.genImage(prompt);
      await writeFile(`${Date.now()}.html`, html(response), {encoding: 'utf-8'});
      expect(!!response).toBe(true);
    }, 120_000);
  });
});

function html(img: string) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <base href="/"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <body>
      <img src="${img}" />
    </body>
  </html>`
}
