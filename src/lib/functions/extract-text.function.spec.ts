import { join } from "node:path";
import { extractText } from "./extract-text.function";

describe('extractText', () => {
  describe('parsing non-pdf files', () => {
    it('extracts the text (duh)', async () => {
      const contents = await extractText(join(process.cwd(), 'libs/server-open-ai/src/lib/assets/test.txt'));

      expect(contents).toMatchSnapshot();
    });
  });

  describe('parsing non-pdf files', () => {
    it.each([
      // 'instant-pot-manual.pdf',
      'swan-shower-base-install-guide.pdf',
    ])('extracts the text (duh)', async (assetPath: string) => {
      const contents = await extractText(join(process.cwd(), `libs/server-open-ai/src/lib/assets/${assetPath}`));

      expect(contents).toMatchSnapshot();
    });
  });
});