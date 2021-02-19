import { parseText } from '../../../src/helpers/parser/text-parser';

describe('parseText', () => {
  test('仅有字符串', () => {
    expect(parseText('foo')).toBe('"foo"');
  });
  test('仅有变量', () => {
    expect(parseText('{{foo}}')).toBe('foo');
  });
  test('字符串和变量', () => {
    expect(parseText('foo - {{foo}} - bar')).toBe('"foo - " + foo + " - bar"');
  });
  test('变量和变量', () => {
    expect(parseText('{{bar}} - {{foo}}')).toBe('bar + " - " + foo');
  });
  test('过滤函数', () => {
    expect(parseText('{{foo | fn}}')).toBe('fn(foo)');
  });
  test('过滤函数带参数', () => {
    expect(parseText('{{foo | fn(2)}}')).toBe('fn(foo,2)');
  });
  test('设置分割符', () => {
    expect(parseText('{foo | fn(2)}', ['{', '}'])).toBe('fn(foo,2)');
  });
});
