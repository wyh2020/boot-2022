import React, { useEffect } from 'react';
import style from './style.css';

export default () => {
  useEffect(() => {
    const outerElement = document.getElementById('outer2') as HTMLDivElement;
    const middleElement = document.getElementById('middle2') as HTMLDivElement;
    const innerElement = document.getElementById('inner2') as HTMLLinkElement;

    outerElement.addEventListener(
      'click',
      function () {
        alert('test2 ==== 触发 外部 div');
        console.log('test2 ==== 触发 外部 div');
      },
      false,
    );
    middleElement.addEventListener(
      'click',
      function () {
        alert('test2 ==== 触发 中间 div');
        console.log('test2 ==== 触发 中间 div');
      },
      false,
    );
    innerElement.addEventListener(
      'click',
      function () {
        alert('test2 ==== 触发 内部 a 按钮');
        console.log('test2 ==== 触发 内部 a 按钮');
      },
      false,
    );
  }, []);

  return (
    <div id="outer2" className={style.outer}>
      外部DIV
      <div id="middle2" className={style.middle}>
        中间DIV
        <a href="" id="inner2" className={style.inner}>
          内部A标签
        </a>
      </div>
    </div>
  );
};
