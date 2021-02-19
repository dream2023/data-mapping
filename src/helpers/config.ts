export type filtersType = Record<string, Function>;
let _filters: filtersType = {};
let _delimiters: [string, string] | undefined;

// 设置过滤函数
export function setFilters(filters: filtersType) {
  _filters = { ..._filters, ...filters };
}

// 设置单个过滤函数
export function setFilter(name: string, filter: Function) {
  _filters[name] = filter;
}

// 获取过滤函数
export function getFilters() {
  return _filters;
}

// 清除 filters
export function clearFilters() {
  _filters = {}
}

// 设置变量分隔符
export function setDelimiters(delimiters?: [string, string]) {
  _delimiters = delimiters;
}

// 获取分隔符
export function getDelimiters() {
  return _delimiters;
}

// 清除分隔符
export function clearDelimiters() {
  _delimiters = undefined
}