import { readFile } from 'node:fs/promises';
import { parse, resolve } from 'node:path';
// this needs to be require cuz this package 'pdf-parse' is ultra hacky
const pdf = require('pdf-parse');
// and looks for a parent module to determine if it's in test mode
const reader = require('any-text');

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
