import { mergeObj, replace$, isNil } from '../../src/helpers/util';

describe('mergeObj', () => {
  test('基本用法', () => {
    expect(mergeObj({ a: 'a', b: 'b', c: 'c' }, { a: 'm', d: 'd' })).toEqual({
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd'
    });
  });
});

describe('replace$', () => {
  test('无 $', () => {
    expect(replace$({ a: 'a', b: 'b' })).toEqual({ a: 'a', b: 'b' });
  });

  test('$ 值为对象，则映射数据', () => {
    expect(replace$({ a: 'a', b: 'b', $: { c: 'c', d: 'd' } })).toEqual({
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd'
    });
  });

  test('$ 值为其他类型值，则不做任何处理', () => {
    expect(replace$({ a: 'a', b: 'b', c: 'c', $: '123' })).toEqual({
      a: 'a',
      b: 'b',
      c: 'c',
      $: '123'
    });
  });
});

describe('isNil', () => {
  test('undefined is isNil', () => {
    expect(isNil()).toBeTruthy();
    expect(isNil(undefined)).toBeTruthy();
  });
  test('null is isNil', () => {
    expect(isNil(null)).toBeTruthy();
  });
  test('others not isNil', () => {
    expect(isNil('')).toBeFalsy();
    expect(isNil(0)).toBeFalsy();
    expect(isNil(false)).toBeFalsy();
    expect(isNil([])).toBeFalsy();
  });
});
