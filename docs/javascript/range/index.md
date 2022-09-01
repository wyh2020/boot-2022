---
title: 2.Range
order: 2
---

## 2.Range & Selection

### Range

<Badge>Range</Badge> 接口表示一个包含节点与文本节点的一部分的文档片段。

可以用 Document 对象的 Document.createRange 方法创建 Range，也可以用 Selection 对象的 getRangeAt 方法获取 Range。另外，还可以通过 Document 对象的构造函数 Range() 来得到 <Badge>Range</Badge>。

#### 属性

- Range.collapsed 只读

  > - 返回一个表示 <Badge>Range</Badge> 的起始位置和终止位置是否相同的布尔值 (en-US)。

- Range.commonAncestorContainer 只读

  > - 返回完整包含 startContainer 和 endContainer 的、最深一级的节点。

- Range.endContainer 只读

  > - 返回包含 <Badge>Range</Badge> 终点的节点。

- Range.endOffset 只读

  > - 返回一个表示 <Badge>Range</Badge> 终点在 endContainer 中的位置的数字。

- Range.startContainer 只读

  > - 返回包含 <Badge>Range</Badge> 开始的节点。

- Range.startOffset 只读
  > - 返回一个表示 <Badge>Range</Badge> 起点在 startContainer 中的位置的数字。

#### 构造器

- Range() Experimental
  > - 返回一个以全局（global）Document 作为起点与终点的 Range 对象。

### Selection

<Badge>Selection</Badge> 对象表示用户选择的文本范围或插入符号的当前位置。它代表页面中的文本选区，可能横跨多个元素。文本选区由用户拖拽鼠标经过文字而产生。要获取用于检查或修改的 <Badge>Selection</Badge> 对象，请调用 `window.getSelection()`。

一般来说，插入光标的位置可通过 `Selection` 获取，这时它被标记为 `Collapsed`，这表示选区被压缩至一点，即光标位置。但要注意它与 `focus` 事件或 Document.activeElement 等的值没有必然联系。

用户可能从左到右（与文档方向相同）选择文本或从右到左（与文档方向相反）选择文本。`anchor` 指向用户开始选择的地方，而 `focus` 指向用户结束选择的地方。如果你使用鼠标选择文本的话，`anchor` 就指向你按下鼠标键的地方，而 `focus` 就指向你松开鼠标键的地方。`anchor` 和 `focus` 的概念不能与选区的起始位置和终止位置混淆，因为 `anchor` 指向的位置可能在 `focus` 指向的位置的前面，也可能在 `focus` 指向位置的后面，这取决于你选择文本时鼠标移动的方向（也就是按下鼠标键和松开鼠标键的位置）。

`Selection` 对象所对应的是用户所选择的 `ranges`（区域），俗称拖蓝。默认情况下，该函数只针对一个区域，我们可以这样使用这个函数：

## lodash 之 range

## 扩展 - createTextRange

- <Badge type="error">非标准: </Badge>

  > - 该特性是非标准的，请尽量不要在生产环境中使用它！

- <Badge type="error">IE Only</Badge>

> - 该属性是 IE 专有的。尽管 IE 很好地支持它，但大部分其它浏览器已经不支持该属性。该属性仅应在需兼容低版本 IE 时作为其中一种方案，而不是在跨浏览器的脚本中完全依赖它。

> - <Badge>TextRange</Badge> 对象表示文档中的文本片段，类似于标准定义的 <Badge>Range</Badge> 接口。

> - 此对象用于表示文档中特定的一段文本，例如在按住鼠标选中页面上的内容时，创建出的就是一个较为典型的 <Badge>TextRange</Badge>。它在 IE 中被实现，可通过 Element.createTextRange() 方法或是 MSSelection.createRange() 方法创建一个 <Badge>TextRange</Badge> 对象。

- <Badge type="error">注意</Badge>
  > - 在非 IE 浏览器不支持该接口，可使用替代的 Selection 及 <Badge>Range</Badge> 接口。

## 参考资料

1、[MDN 地址](https://developer.mozilla.org/zh-CN/docs/Web/API/Range)
