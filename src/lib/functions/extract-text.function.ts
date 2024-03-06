import { readFile } from 'node:fs/promises';
import { parse, resolve } from 'node:path';
import pdf from 'pdf-parse';

var reader = require('any-text');

export async function extractText(path: string): Promise<string> {
  const { ext } = parse(path);

  if (ext.toLowerCase().includes('pdf')) {
    // todo: the pdf extraction isn't perfect...
    // ex: line breaks aren't always translated to spaces so subsequent words across line-breaks are inaccurately extracted as a single word
    // but i think this was a faulty regext downstream and not this code... tbd... will test
    const pdfFile = resolve(path);
    const dataBuffer = await readFile(pdfFile);
    const data = await pdf(dataBuffer);
    return data.text;
  } else {
    return await reader.getText(path);
  }
}
