import {
  setFilter,
  setFilters,
  clearFilters,
  getFilters,
  setDelimiters,
  getDelimiters,
  clearDelimiters
} from '../../src/helpers/config';

describe('filter', () => {
  afterEach(() => {
    clearFilters();
  });

  test('setFilter 设置单个过滤函数', () => {
    const fn = jest.fn();
    // 需要制定 name 和函数
    setFilter('fn', fn);
    expect(getFilters()).toEqual({ fn });

    // 多次调用是合并的关系
    const fn2 = jest.fn();
    setFilter('fn2', fn2);
    expect(getFilters()).toEqual({ fn, fn2 });
  });

  test('setFilters 设置多个过滤函数', () => {
    const fn = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();
    // 可以传递一个对象
    setFilters({ fn, fn2 });
    expect(getFilters()).toEqual({ fn, fn2 });

    // 多次调用是合并的关系
    setFilters({ fn3 });
    expect(getFilters()).toEqual({ fn, fn2, fn3 });
  });

  test('clearFilters 清除过滤函数', () => {
    setFilters({ fn: jest.fn });

    clearFilters();
    expect(getFilters()).toEqual({});
  });
});

describe('delimiters', () => {
  afterEach(() => {
    clearDelimiters();
  });

  test('setDelimiters 设置分隔符', () => {
    setDelimiters(['${', '}']);
    expect(getDelimiters()).toEqual(['${', '}']);
  });

  test('clearDelimiters 清除分隔符', () => {
    setDelimiters(['${', '}']);
    clearDelimiters();
    expect(getDelimiters()).toBeUndefined();
  });
});
