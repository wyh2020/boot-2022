import React, { useEffect } from 'react';
import style from './style.css';

export default () => {
  useEffect(() => {
    const outerElement = document.getElementById('outer6') as HTMLDivElement;
    const middleElement = document.getElementById('middle6') as HTMLDivElement;
    const innerElement = document.getElementById('inner6') as HTMLLinkElement;

    outerElement.addEventListener(
      'click',
      function () {
        alert('test6 ==== 触发 外部 div');
        console.log('test6 ==== 触发 外部 div');
      },
      false,
    );
    middleElement.addEventListener(
      'click',
      function () {
        alert('test6 ==== 触发 中间 div');
        console.log('test6 ==== 触发 中间 div');
      },
      false,
    );
    innerElement.addEventListener(
      'click',
      function (event) {
        alert('test6 ==== 触发 内部 a 按钮');
        console.log('test6 ==== 触发 内部 a 按钮');
        return false;
      },
      false,
    );
  }, []);

  return (
    <div id="outer6" className={style.outer}>
      外部DIV
      <div id="middle6" className={style.middle}>
        中间DIV
        <a href="" id="inner6" className={style.inner}>
          内部A标签
        </a>
      </div>
    </div>
  );
};
