---
title: 3.stopPropagation
order: 3
---

## 3.stopPropagation VS preventDefault

### 描述

- `preventDefault`, `prevent` 是动词, 意为 `防止，阻止`; `Default` 是名词, 有`系统默认值`的意思, `preventDefault` 在 js 中的意思就是`阻止系统默认（行为）`.

- `stopPropagation`, `stop` 是动词, 意为`中止`; `Propagation` 是名词, 意为 `传播`, `stopPropagation` 意为 `中止传播`, 在 js 中的意思是`阻止js事件冒泡`.

### javascript 中的 `事件传播` 模式

- 捕获模式(capturing)
- 冒泡模式(bubbling)

#### 特点

- 从外到内（捕获模式）=> `从上向下`

  > - 当事件发生时，该事件首先被最外层元素接受到，然后依次向内层元素传播。（从上向下）

- 从内到外（冒泡模式）=> `从下向上`
  > - 当事件发生时，该事件首先被最内层元素接受到，然后依次向外层元素传播。（从下向上）

<b>IE9 以下仅仅支持冒泡模式，但是 IE9+以及现在的主流浏览器都支持两种模式了。</b>

模式不同就决定了 html 中`元素`(比如 div, p, button)接收到事件的`顺序`. 接收到事件的顺序不同，事件监听函数被触发的顺序就不同了，于是监听函数被执行顺序就不同.

#### 声明方式

用哪种事件传播方式完全是我们自己说了算的，我们可以使用

`addEventListener(type, listener, useCapture)`

来注册事件处理方式，以及以何种传播模式进行。

<b>实例 1: 捕获模式 `addEventListener` 第三个参数为 `true`</b>

- <font color="#FF000">触发 外部 div</font> &Longrightarrow; <font color="#008000">触发 中间 div</font> &Longrightarrow; <font color="#FFD700">触发 内部 a 按钮</font> &Longrightarrow; <font color="#000000">触发 a 的默认行为</font>

```tsx
import React from 'react';
import Test1 from '../../src/javascript/stoppropagation/test1';
export default () => <Test1 />;
```

<b>实例 2: 冒泡模式 `addEventListener` 第三个参数为 `false` (`默认值`)</b>

- <font color="#FFD700">触发 内部 a 按钮</font> &Longrightarrow; <font color="#008000">触发 中间 div</font> &Longrightarrow; <font color="#FF000">触发 外部 div</font> &Longrightarrow; <font color="#000000">触发 a 的默认行为</font>

```tsx
import React from 'react';
import Test2 from '../../src/javascript/stoppropagation/test2';
export default () => <Test2 />;
```

<b>实例 3: 冒泡模式 + `event.preventDefault()` (默认行为被阻止)</b>

- <font color="#FFD700">触发 内部 a 按钮</font> &Longrightarrow; <font color="#008000">触发 中间 div</font> &Longrightarrow; <font color="#FF000">触发 外部 div</font>

```tsx
import React from 'react';
import Test3 from '../../src/javascript/stoppropagation/test3';
export default () => <Test3 />;
```

<b>实例 4: 冒泡模式 + `event.stopPropagation()` (冒泡被中止)</b>

- <font color="#FFD700">触发 内部 a 按钮</font> &Longrightarrow; <font color="#000000">触发 a 的默认行为</font>

```tsx
import React from 'react';
import Test4 from '../../src/javascript/stoppropagation/test4';
export default () => <Test4 />;
```

<b>实例 5: 冒泡模式 + `event.preventDefault() + event.stopPropagation()` (默认行为被阻止 + 冒泡被中止) </b>

- <font color="#FFD700">触发 内部 a 按钮</font>

```tsx
import React from 'react';
import Test5 from '../../src/javascript/stoppropagation/test5';
export default () => <Test5 />;
```

<b>实例 6: 冒泡模式 + `return false` (`return false`没有任何用) </b>

- <font color="#FFD700">触发 内部 a 按钮</font> &Longrightarrow; <font color="#008000">触发 中间 div</font> &Longrightarrow; <font color="#FF000">触发 外部 div</font> &Longrightarrow; <font color="#000000">触发 a 的默认行为</font>

```tsx
import React from 'react';
import Test6 from '../../src/javascript/stoppropagation/test6';
export default () => <Test6 />;
```

1、[stopPropagation MDN 地址](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopPropagation)

2、[preventDefault MDN 地址](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault)

3、[whats-the-difference-between-event-stoppropagation-and-event-preventdefault](https://stackoverflow.com/questions/5963669/whats-the-difference-between-event-stoppropagation-and-event-preventdefault)
