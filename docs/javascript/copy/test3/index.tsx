import React, { useState } from 'react';
import style from './style.css';

export default () => {
  const [inputText, setInputText] = useState('Hello Input!');

  const toCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const copyInput = () => {
    const inputDom = document.getElementById('input') as HTMLInputElement;
    toCopy(inputDom.value);
  };

  const copyDiv = () => {
    const divDom = document.getElementById('div') as HTMLInputElement;
    toCopy(divDom.innerText);
  };
  return (
    <div className={style.content}>
      <div className={style.textDiv}>
        <span className={style.textSpan}>Input</span>
        <input
          id="input"
          value={inputText}
          onChange={(d) => setInputText(d.target.value)}
        ></input>
        <button className={style.textButton} onClick={() => copyInput()}>
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
