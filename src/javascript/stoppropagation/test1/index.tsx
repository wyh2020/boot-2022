import React, { useEffect } from 'react';
import style from './style.css';

export default () => {
  useEffect(() => {
    const outerElement = document.getElementById('outer1') as HTMLDivElement;
    const middleElement = document.getElementById('middle1') as HTMLDivElement;
    const innerElement = document.getElementById('inner1') as HTMLLinkElement;

    outerElement.addEventListener(
      'click',
      function () {
        alert('test1 ==== 触发 外部 div');
        console.log('test1 ==== 触发 外部 div');
      },
      true,
    );
    middleElement.addEventListener(
      'click',
      function () {
        alert('test1 ==== 触发 中间 div');
        console.log('test1 ==== 触发 中间 div');
      },
      true,
    );
    innerElement.addEventListener(
      'click',
      function () {
        alert('test1 ==== 触发 内部 a 按钮');
        console.log('test1 ==== 触发 内部 a 按钮');
      },
      true,
    );
  }, []);

  return (
    <div id="outer1" className={style.outer}>
      外部DIV
      <div id="middle1" className={style.middle}>
        中间DIV
        <a href="" id="inner1" className={style.inner}>
          内部A标签
        </a>
      </div>
    </div>
  );
};
