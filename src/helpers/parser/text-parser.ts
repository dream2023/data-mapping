import { parseFilters } from './filter-parser';

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
const regexEscapeRE = /[-.*+?^${}()|[\]/\\]/g;

const buildRegex = (delimiters: [string, string]) => {
  const open = delimiters[0].replace(regexEscapeRE, '\\$&');
  const close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
};

export function parseText(text: string, delimiters?: [string, string]): string {
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return `"${text}"`;
  }
  const tokens = [];
  const rawTokens = [];
  let lastIndex = (tagRE.lastIndex = 0);
  let match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push((tokenValue = text.slice(lastIndex, index)));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    const exp = parseFilters(match[1].trim());
    tokens.push(exp);
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokenValue = text.slice(lastIndex);
    tokens.push(JSON.stringify(tokenValue));
  }
  return tokens.join(' + ');
}
