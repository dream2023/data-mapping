import vm from 'vm';
import mapObject from 'map-obj';
import {
  parseText,
  getDelimiters,
  getFilters,
  replace$,
  isNil
} from './helpers';

// 字符串编译
export function compilerStr(
  str: string,
  data: Record<string, any> | null | undefined
) {
  // 如果 data 为空，则直接返回字符串
  if (isNil(data)) return str;
  const exp = parseText(str, getDelimiters());
  // 字符串和表达式相同，则直接返回字符串
  // 否则进行解析，并将数据和过滤器传递进去
  return exp === `"${str}"`
    ? str
    : vm.runInNewContext(exp, { ...data, ...getFilters() });
}

// 对象数据映射
export function dataMapping(
  schema: Record<string, any> | null | undefined,
  data: Record<string, any> | null | undefined
) {
  if (isNil(data) || isNil(schema)) return schema;

  // 遍历每个 schema 对象
  const res = mapObject(
    schema,
    (key: any, val: any) => {
      if (typeof val === 'string') {
        return [key, compilerStr(val, data)];
      } else {
        return [key, val];
      }
    },
    { deep: true }
  );

  return replace$(res);
}
