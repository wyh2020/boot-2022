---
title: 1.链表
order: 1
---

## 1.单链表

### 描述

在计算机科学中, 一个链表是数据元素的`线性`集合, 元素的线性顺序不是由它们在内存中的物理位置给出的。 相反, 每个元素指向下一个元素。它是由一组节点组成的数据结构,这些节点一起,表示序列。

在最简单的形式下，每个节点由数据和到序列中`下一个节点的引用`(换句话说，`链接`)组成。这种结构允许在迭代期间有效地从序列中的任何位置插入或删除元素。

更复杂的变体添加额外的链接，允许有效地插入或删除任意元素引用。链表的一个`缺点是访问时间是线性的`(而且难以管道化)。

更快的访问，如随机访问，是不可行的。与链表相比，数组具有更好的缓存位置。

  <img src="../../src/images/linked-list/linked-list-01.png" height="120">

链表有两种类型：单链表和双链表。上面给出的例子是一个单链表，这里有一个双链表的例子：

  <img src="../../src/images/linked-list/linked-list-02.png" height="120">

#### Node 类

```js
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
```

#### Linked-list 类

```js
class SingleList {
  constructor() {
    this.size = 0; // 单链表的长度
    this.head = new Node('head'); // 表头节点
    this.currNode = ''; // 当前节点的指向
  }

  find(item) {} // 在单链表中寻找item元素
  insert(item, element) {} // 向单链表中插入元素
  remove(item) {} // 在单链表中删除一个节点
  append(element) {} // 在单链表的尾部添加元素
  findLast() {} // 获取单链表的最后一个节点
  isEmpty() {} // 判断单链表是否为空
  show() {} // 显示当前节点
  getLength() {} // 获取单链表的长度
  advance(n, currNode) {} // 从当前节点向前移动n个位置
  display() {} // 单链表的遍历显示
  clear() {} // 清空单链表
}
```

### 基本操作

#### 搜索

```js
  // 在单链表中寻找item元素
  find(item) {
    let currNode = this.head;

    while (currNode && (currNode.data !== item)) {
      currNode = currNode.next;
    }

    return currNode;
  }
```

#### 插入

#### 删除

#### 遍历

#### 反向遍历

### 复杂度

#### 时间复杂度

#### 空间复杂度

O(n)

### 参考资料
