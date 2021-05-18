import {
  dataMapping,
  compilerStr,
  setFilters,
  clearFilters,
  setDelimiters,
  clearDelimiters
} from '../src';

describe('compilerStr', () => {
  test('data 为 undefined | null', () => {
    expect(compilerStr('this is {{foo}}', undefined)).toBe('this is {{foo}}');
    expect(compilerStr('this is {{foo}}', null)).toBe('this is {{foo}}');
  });

  test('str 为 undefined', () => {
    expect(compilerStr(undefined, { name: 'age' })).toBe(undefined);
  });

  test('str 仅有字符串', () => {
    expect(compilerStr('this is str', {})).toBe('this is str');
  });

  test('data 中不存在相应的变量', () => {
    expect(() => compilerStr('this is {{foo}}', { bar: '123' })).toThrowError();
  });

  test('str 中存在相应的变量', () => {
    expect(compilerStr('this is {{foo}}', { foo: '123' })).toBe('this is 123');
  });

  test('多级变量', () => {
    expect(compilerStr('this is {{info.foo}}', { info: { foo: '123' } })).toBe(
      'this is 123'
    );
    expect(
      compilerStr('this is {{info["foo"]}}', { info: { foo: '123' } })
    ).toBe('this is 123');
    expect(
      compilerStr("this is {{info['foo']}}", { info: { foo: '123' } })
    ).toBe('this is 123');
  });
  test('表达式', () => {
    expect(compilerStr("{{ok ? 'YES' : 'NO'}}", { ok: true })).toBe('YES');
    expect(
      compilerStr("{{message.split('').reverse().join('')}}", {
        message: 'are you ok?'
      })
    ).toBe('?ko uoy era');
  });
  test('原生函数作为 filter', () => {
    expect(compilerStr('num = {{num | parseInt}}', { num: 100.01 })).toBe(
      'num = 100'
    );
  });
  test('自定义 filter', () => {
    setFilters({
      toUpperCase: (val: string) => val.toUpperCase()
    });
    expect(compilerStr('{{name | toUpperCase}}', { name: 'foo' })).toBe('FOO');
    clearFilters();
  });

  test('filter 带参数', () => {
    expect(
      compilerStr('{{info | JSON.stringify(null, 2)}}', {
        info: { name: 'foo' }
      })
    ).toBe(JSON.stringify({ name: 'foo' }, null, 2));
  });

  test('自定义分隔符', () => {
    expect(
      // eslint-disable-next-line no-template-curly-in-string
      compilerStr(
        '${foo}',
        {
          foo: 'bar'
        },
        ['${', '}']
      )
    ).toBe('bar');
  });

  test('配置自定义分隔符', () => {
    setDelimiters(['${', '}']);
    expect(
      // eslint-disable-next-line no-template-curly-in-string
      compilerStr('${foo}', {
        foo: 'bar'
      })
    ).toBe('bar');

    clearDelimiters();
  });
});

describe('dataMapping', () => {
  test('data 或 schema 为 undefined 或者 null 时，返回 schema-data', () => {
    expect(
      dataMapping({ schema: { name: '{{name}}' }, data: undefined })
    ).toEqual({
      name: '{{name}}'
    });
    expect(dataMapping({ schema: { name: '{{name}}' }, data: null })).toEqual({
      name: '{{name}}'
    });

    expect(dataMapping({ schema: undefined, data: { name: '123' } })).toEqual({
      name: '123'
    });
    expect(dataMapping({ schema: null, data: { name: '123' } })).toEqual({
      name: '123'
    });
  });
  test('data 或 schema 为 undefined 或者 null 时，返回 data', () => {
    expect(
      dataMapping({
        schema: undefined,
        data: { foo: 'bar' },
        defaultValue: 'data'
      })
    ).toEqual({
      foo: 'bar'
    });

    expect(
      dataMapping({ schema: null, data: { foo: 'bar' }, defaultValue: 'data' })
    ).toEqual({
      foo: 'bar'
    });
  });
  test('data 或 schema 为 undefined 或者 null 时，返回 schema', () => {
    expect(
      dataMapping({
        schema: undefined,
        data: { foo: 'bar' },
        defaultValue: 'schema'
      })
    ).toEqual(undefined);

    expect(
      dataMapping({
        schema: null,
        data: { foo: 'bar' },
        defaultValue: 'schema'
      })
    ).toEqual(null);
  });

  test('schema 为字符串时', () => {
    expect(dataMapping({ schema: '{{num + 1}}', data: { num: 1 } })).toEqual(2);
  });

  test('schema 为函数时', () => {
    expect(
      dataMapping({ schema: (data) => data.num + 1, data: { num: 1 } })
    ).toEqual(2);
  });

  test('对象映射', () => {
    expect(
      dataMapping({
        schema: { foo: 456, bar: '{{bar}}', zoo: 'zoo' },
        data: { foo: 123, bar: 'test' }
      })
    ).toEqual({ foo: 456, bar: 'test', zoo: 'zoo' });
  });

  test('值为函数', () => {
    expect(
      dataMapping({
        schema: {
          country(data: any) {
            return data.address.split('-')[0];
          },
          province(data: any) {
            return data.address.split('-')[1];
          }
        },
        data: { address: 'china-guangzhou' }
      })
    ).toEqual({ country: 'china', province: 'guangzhou' });
  });

  test('深度 schema 映射', () => {
    expect(
      dataMapping({ schema: { foo: { bar: '{{bar}}' } }, data: { bar: 123 } })
    ).toEqual({
      foo: { bar: 123 }
    });
  });

  test('深度 data 映射', () => {
    expect(
      dataMapping({
        schema: { name: '{{info.name}}' },
        data: { info: { name: 'jack' } }
      })
    ).toEqual({
      name: 'jack'
    });
  });

  test('原生 filter', () => {
    expect(
      dataMapping({
        schema: { num: '{{num | parseInt}}' },
        data: { num: 100.01 }
      })
    ).toEqual({
      num: 100
    });
  });

  test('自定义 filter', () => {
    setFilters({
      toUpperCase: (val: string) => val.toUpperCase()
    });

    expect(
      dataMapping({
        schema: { name: '{{name | toUpperCase}}' },
        data: { name: 'foo' }
      })
    ).toEqual({
      name: 'FOO'
    });

    clearFilters();
  });

  test('替换 $', () => {
    expect(
      dataMapping({
        schema: { a: '{{a}}', $: '{{info}}' },
        data: { a: 'a', info: { name: 'jack', age: 18 } }
      })
    ).toEqual({ a: 'a', name: 'jack', age: 18 });
  });

  test('自定义分隔符', () => {
    expect(
      dataMapping(
        // eslint-disable-next-line no-template-curly-in-string
        {
          schema: { name: '${info.name}' },
          data: {
            info: { name: 'jack' }
          },
          delimiters: ['${', '}']
        }
      )
    ).toEqual({ name: 'jack' });
  });

  test('配置自定义分隔符', () => {
    setDelimiters(['${', '}']);
    expect(
      dataMapping(
        // eslint-disable-next-line no-template-curly-in-string
        {
          schema: { name: '${info.name}' },
          data: {
            info: { name: 'jack' }
          }
        }
      )
    ).toEqual({ name: 'jack' });

    clearDelimiters();
  });
});
