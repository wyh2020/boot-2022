import React from 'react';
import style from './style.css';

export default () => {
  const toCopy = (text: string) => {
    // 创建输入框
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    // 隐藏此输入框
    textarea.style.position = 'absolute';
    textarea.style.clip = 'rect(0 0 0 0)';
    // 赋值
    textarea.value = text;
    // 选中
    textarea.select();
    // 复制
    document.execCommand('copy', true);
  };

  const copySpan = () => {
    const spanDom = document.getElementById('span') as HTMLInputElement;
    toCopy(spanDom.innerText);
  };

  const copyDiv = () => {
    const divDom = document.getElementById('div') as HTMLInputElement;
    toCopy(divDom.innerText);
  };
  return (
    <div className={style.content}>
      <div className={style.textDiv}>
        <span id="span" className={style.textSpan}>
          Hello Span!
        </span>
        <button className={style.textButton} onClick={() => copySpan()}>
          复制
        </button>
      </div>
      <div className={style.textDiv}>
        <div id="div" className={style.textSpan}>
          Hello Div!
        </div>
        <button className={style.textButton} onClick={() => copyDiv()}>
          复制
        </button>
      </div>
    </div>
  );
};
