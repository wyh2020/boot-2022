import React, { useEffect } from 'react';
import style from './style.css';

export default () => {
  useEffect(() => {
    const outerElement = document.getElementById('outer4') as HTMLDivElement;
    const middleElement = document.getElementById('middle4') as HTMLDivElement;
    const innerElement = document.getElementById('inner4') as HTMLLinkElement;

    outerElement.addEventListener(
      'click',
      function () {
        alert('test4 ==== 触发 外部 div');
        console.log('test4 ==== 触发 外部 div');
      },
      false,
    );
    middleElement.addEventListener(
      'click',
      function () {
        alert('test4 ==== 触发 中间 div');
        console.log('test4 ==== 触发 中间 div');
      },
      false,
    );
    innerElement.addEventListener(
      'click',
      function (event) {
        // event.preventDefault();
        event.stopPropagation();
        alert('test4 ==== 触发 内部 a 按钮');
        console.log('test4 ==== 触发 内部 a 按钮');
      },
      false,
    );
  }, []);

  return (
    <div id="outer4" className={style.outer}>
      外部DIV
      <div id="middle4" className={style.middle}>
        中间DIV
        <a href="" id="inner4" className={style.inner}>
          内部A标签
        </a>
      </div>
    </div>
  );
};
