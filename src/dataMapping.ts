import vm from 'vm';
import mapObject from 'map-obj';
import {
  isNil,
  replace$,
  parseText,
  getFilters,
  getDelimiters
} from './helpers';

// 字符串编译
export function compilerStr(
  str?: string,
  data?: Record<string, any> | null,
  delimiters?: [string, string]
) {
  // 如果 str 或者 data 为空，则直接返回字符串
  if (isNil(str) || isNil(data)) return str;
  const exp = parseText(str, delimiters || getDelimiters());
  // 字符串和表达式相同，则直接返回字符串
  // 否则进行解析，并将数据和过滤器传递进去
  return exp === `"${str}"`
    ? str
    : vm.runInNewContext(exp, { ...data, ...getFilters() });
}

export type SchemaType =
  | Record<string, any>
  | ((data: any) => any)
  | string
  | null
  | undefined;

export interface DataMappingOptions {
  schema: SchemaType;
  data?: Record<string, any> | null;
  delimiters?: [string, string];
  defaultValue?: 'schema' | 'data';
}

// 对象数据映射
export function dataMapping({
  schema,
  data,
  delimiters,
  defaultValue = 'schema'
}: DataMappingOptions) {
  if (isNil(data) || isNil(schema)) {
    return defaultValue === 'schema' ? schema : data;
  }

  if (typeof schema === 'string') return compilerStr(schema, data, delimiters);
  if (typeof schema === 'function') return schema(data);

  // 遍历每个 schema 对象
  const res = mapObject(
    schema,
    (key: any, val: any) => {
      if (typeof val === 'string') {
        return [key, compilerStr(val, data, delimiters)];
      } else if (typeof val === 'function') {
        return [key, val(data)];
      } else {
        return [key, val];
      }
    },
    { deep: true }
  );

  return replace$(res);
}
