import React, { useEffect } from 'react';
import style from './style.css';

export default () => {
  useEffect(() => {
    const outerElement = document.getElementById('outer3') as HTMLDivElement;
    const middleElement = document.getElementById('middle3') as HTMLDivElement;
    const innerElement = document.getElementById('inner3') as HTMLLinkElement;

    outerElement.addEventListener(
      'click',
      function () {
        alert('test3 ==== 触发 外部 div');
        console.log('test3 ==== 触发 外部 div');
      },
      false,
    );
    middleElement.addEventListener(
      'click',
      function () {
        alert('test3 ==== 触发 中间 div');
        console.log('test3 ==== 触发 中间 div');
      },
      false,
    );
    innerElement.addEventListener(
      'click',
      function (event) {
        event.preventDefault();
        // event.stopPropagation();
        alert('test3 ==== 触发 内部 a 按钮');
        console.log('test3 ==== 触发 内部 a 按钮');
      },
      false,
    );
  }, []);

  return (
    <div id="outer3" className={style.outer}>
      外部DIV
      <div id="middle3" className={style.middle}>
        中间DIV
        <a href="" id="inner3" className={style.inner}>
          内部A标签
        </a>
      </div>
    </div>
  );
};
