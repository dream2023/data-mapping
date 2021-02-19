import { parseFilters } from '../../../src/helpers/parser/filter-parser';

describe('parseFilters', () => {
  test('仅有变量', () => {
    expect(parseFilters('foo')).toBe('foo');
  });

  test('有 1 个过滤函数', () => {
    expect(parseFilters('foo | fn')).toBe('fn(foo)');
    expect(parseFilters('foo | fn()')).toBe('fn(foo)');
  });

  test('过滤函数有参数', () => {
    expect(parseFilters('foo | fn(2, "str")')).toBe('fn(foo,2, "str")');
  });

  test('有 2 个过滤函数', () => {
    expect(parseFilters('foo | fn1 | fn2')).toBe('fn2(fn1(foo))');
  });

  test('有 2 个过滤函数都带参数', () => {
    expect(parseFilters('foo | fn1("bar", 2) | fn2("zoo")')).toBe(
      'fn2(fn1(foo,"bar", 2),"zoo")'
    );
  });

  test('变量为字符串', () => {
    // 双引号
    expect(parseFilters('"str"')).toBe('"str"');
    // 单引号
    expect(parseFilters("'str'")).toBe("'str'");
  });

  test('变量为字符串模板', () => {
    expect(parseFilters('`str`')).toBe('`str`');
  });

  test('变量为正则', () => {
    expect(parseFilters('/foo/')).toBe('/foo/');
  });

  test('多级', () => {
    expect(parseFilters('foo.bar')).toBe('foo.bar');
    expect(parseFilters('foo["bar"]')).toBe('foo["bar"]');
  });

  test('大括号', () => {
    // eslint-disable-next-line no-template-curly-in-string
    expect(parseFilters('${test}')).toBe('${test}');
  });

  test('参数为正则', () => {
    expect(parseFilters('foo | fn(/bar/)')).toBe('fn(foo,/bar/)');
  });
});
