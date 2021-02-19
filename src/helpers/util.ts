// 合并对象
export function mergeObj(
  target: Record<string, any>,
  source: Record<string, any>
) {
  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target);
  sourceKeys.forEach((sourceKey) => {
    if (!targetKeys.includes(sourceKey)) {
      target[sourceKey] = source[sourceKey];
    }
  });

  return target;
}

// 替换 $ 符号
export function replace$(target: Record<string, any>) {
  if (Object.prototype.toString.call(target['$']) === '[object Object]') {
    // 展开对象
    target = mergeObj(target, target['$']);
    delete target['$'];
  }
  return target;
}

// 是否为 undefined 或者 null
export const isNil = (val?: unknown): val is undefined | null => {
  return val === undefined || val === null;
};
