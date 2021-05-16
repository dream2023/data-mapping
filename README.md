<h1 align="center">@dream2023/data-mapping</h1>

![npm version](https://img.shields.io/npm/v/@dream2023/data-mapping?style=for-the-badge)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@dream2023/data-mapping?style=for-the-badge)
![npm downloads](https://img.shields.io/npm/dt/@dream2023/data-mapping?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/@dream2023/data-mapping?style=for-the-badge)

## 介绍

`@dream2023/data-mapping` 通过抽离并融合 `vue 2` 中的表达式解析能力，以及自身的数据映射能力，形成了小巧而功能完善的表达式和对象解析引擎。

## 特点

- 体积小：源码 3Kb + 依赖 4Kb = 7Kb；
- 能力强：支持深度对象、自定义分隔符、自定义过滤器等；
- 稳定性高：测试覆盖率 100%。

## 快速上手

```bash
yarn add @dream2023/data-mapping # npm install -S @dream2023/data-mapping
```

```js
import { compilerStr, dataMapping } from '@dream2023/data-mapping';

compilerStr('{{name}}', { name: 'jack' }); // "jack"

dataMapping({
  schema: { username: '{{ info.name }}', address: '{{ address }}' },
  data: { info: { name: '夏洛克福尔摩斯' }, address: '伦敦贝克街221号' }
}); // { username: '夏洛克福尔摩斯', address: '伦敦贝克街221号' }
```

## 功能详解

### 模板字符串

```js
compilerStr('{{name}}', { name: 'jack' }); // "jack"
```

`compilerStr` 接受两个参数，第一个参数为需要编译的字符串模板，第二个参数为数据对象，字符串模板会根据数据对象编译出相应的结果。

```js
compilerStr('{{firstName}} -- {{lastName}}', {
  firstName: 'jack',
  lastName: 'li'
}); // "jack --- li"
```

它不仅可以作为单个变量的取值，还可以是多个变量组成的字符串。

### 表达式

```js
compilerStr("{{ok ? 'YES' : 'NO'}}", { ok: true }); // "YES"

compilerStr("{{message.split('').reverse().join('')}}", {
  message: 'are you ok?'
}); // "?ko uoy era"
```

不仅可以取值，内部还可以使用表达式。

### 支持链式取值

```js
compilerStr(
  'My name is {{name}}. I live in {{address.area}}, {{address.city}}',
  {
    name: 'jack',
    address: {
      city: 'Shenzhen',
      area: 'Nanshan'
    }
  }
);
```

### 对象数据映射

`@dream2023/data-mapping` 不仅提供了对字符串的编译，还提供了对对象的编译。

```js
dataMapping({
  schema: { username: '{{name}}', password: '{{pwd}}' },
  data: { name: 'jack', pwd: 'helloworld' }
}); // { username: 'jack', password: 'helloworld' }
```

当然，其也是支持深度嵌套，以及上述 `compilerStr` 所有特性。

```js
// 支持函数
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
}); // { country: 'china', province: 'guangzhou' }
```

### 过滤器

过滤器是对数据映射的一种增强，它的作用是对获取数据做一些处理，其用法同 vue2 中的[过滤器](https://cn.vuejs.org/v2/guide/filters.html)：

```
{{ message | filterA | filterB }}
```

#### 自定义过滤器

```js
import { setFilter, setFilters, clearFilters } from '@dream2023/data-mapping';

// 实现一个函数
const capitalize = (value) => {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
};

// 设置单个过滤器
setFilter('capitalize', capitalize);

// 设置多个过滤器
setFilters({ capitalize });

// 使用
compilerStr('{{ message | capitalize }}', { message: 'hello' }); // Hello

// 如果不想用过滤器，也可以清除
clearFilters();
```

### 分隔符

如果你觉得默认的分隔符不符合你的习惯，可以更改分隔符，具体如下：

```js
import {
  compilerStr,
  setDelimiters,
  clearDelimiters
} from '@dream2023/data-mapping';

// 设置分隔符
setDelimiters(['${', '}']);

// 使用
compilerStr('My Name is ${name}', { name: 'Jack' });

// 当然，设置后也可以清除
clearDelimiters();
```

因为是全局设置，会影响上述 DEMO，所以这里就不做演示了。

### $ 符便捷展开对象

我们首先看下面示例，我们需要将 `longitude` 和 `latitude` 从 `loc` 字段中抽离到上一层级，我们就需要下面这样写 👇：

```js
dataMapping({
  schema: {
    name: '{{name}}',
    longitude: '{{loc.longitude}}',
    latitude: '{{loc.latitude}}'
  },
  data: {
    name: 'jack',
    loc: { longitude: 118.366899, latitude: 40.90281 }
  }
}); // {  name: 'jack', longitude: 118.366899, latitude: 40.90281 }
```

其实两个字段还好，如果属性非常多的时候就比较麻烦，此时我们可以通过 `$` 便捷的实现展开：

```js
dataMapping({
  schema: {
    name: '{{name}}',
    $: '{{loc}}'
  },
  data: {
    name: 'jack',
    loc: { longitude: 118.366899, latitude: 40.90281 }
  }
}); // {  name: 'jack', longitude: 118.366899, latitude: 40.90281 }
```

## 相关链接

- [vue filters](https://cn.vuejs.org/v2/guide/filters.html)
