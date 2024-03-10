import { join } from "node:path";
import { extractText } from "./extract-text.function";

const testAssetDirectory = 'test';

describe('extractText', () => {
  describe('parsing non-pdf files', () => {
    it('extracts the text (duh)', async () => {
      const contents = await extractText(join(process.cwd(), `${testAssetDirectory}/test.txt`));

      expect(contents).toMatchSnapshot();
    });
  });

  describe('parsing non-pdf files', () => {
    it.each([
      'swan-shower-base-install-guide.pdf',
    ])('extracts the text (duh)', async (assetPath: string) => {
      const contents = await extractText(join(process.cwd(), `${testAssetDirectory}/${assetPath}`));

      expect(contents).toMatchSnapshot();
    });
  });
});