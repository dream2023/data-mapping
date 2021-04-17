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
  test('data 或 schema 为 undefined 或者 null 时，返回 schema', () => {
    expect(dataMapping({ name: '{{name}}' }, undefined)).toEqual({
      name: '{{name}}'
    });
    expect(dataMapping({ name: '{{name}}' }, null)).toEqual({
      name: '{{name}}'
    });

    expect(dataMapping(undefined, { name: '123' })).toEqual(undefined);
    expect(dataMapping(null, { name: '123' })).toEqual(null);
  });

  test('对象映射', () => {
    expect(
      dataMapping(
        { foo: 456, bar: '{{bar}}', zoo: 'zoo' },
        { foo: 123, bar: 'test' }
      )
    ).toEqual({ foo: 456, bar: 'test', zoo: 'zoo' });
  });

  test('值为函数', () => {
    expect(
      dataMapping(
        {
          country(data: any) {
            return data.address.split('-')[0];
          },
          province(data: any) {
            return data.address.split('-')[1];
          }
        },
        { address: 'china-guangzhou' }
      )
    ).toEqual({ country: 'china', province: 'guangzhou' });
  });

  test('深度 schema 映射', () => {
    expect(dataMapping({ foo: { bar: '{{bar}}' } }, { bar: 123 })).toEqual({
      foo: { bar: 123 }
    });
  });

  test('深度 data 映射', () => {
    expect(
      dataMapping({ name: '{{info.name}}' }, { info: { name: 'jack' } })
    ).toEqual({
      name: 'jack'
    });
  });

  test('原生 filter', () => {
    expect(dataMapping({ num: '{{num | parseInt}}' }, { num: 100.01 })).toEqual(
      {
        num: 100
      }
    );
  });

  test('自定义 filter', () => {
    setFilters({
      toUpperCase: (val: string) => val.toUpperCase()
    });

    expect(
      dataMapping({ name: '{{name | toUpperCase}}' }, { name: 'foo' })
    ).toEqual({
      name: 'FOO'
    });

    clearFilters();
  });

  test('替换 $', () => {
    expect(
      dataMapping(
        { a: '{{a}}', $: '{{info}}' },
        { a: 'a', info: { name: 'jack', age: 18 } }
      )
    ).toEqual({ a: 'a', name: 'jack', age: 18 });
  });

  test('自定义分隔符', () => {
    expect(
      dataMapping(
        // eslint-disable-next-line no-template-curly-in-string
        { name: '${info.name}' },
        {
          info: { name: 'jack' }
        },
        ['${', '}']
      )
    ).toEqual({ name: 'jack' });
  });

  test('配置自定义分隔符', () => {
    setDelimiters(['${', '}']);
    expect(
      dataMapping(
        // eslint-disable-next-line no-template-curly-in-string
        { name: '${info.name}' },
        {
          info: { name: 'jack' }
        }
      )
    ).toEqual({ name: 'jack' });

    clearDelimiters();
  });
});
