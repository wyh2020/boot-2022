import React, { useState } from 'react';
import style from './style.css';

export default () => {
  const [inputText, setInputText] = useState('Hello Input!');
  const [textareaText, setTextareaText] = useState('Hello Textarea!');

  const copyInput = () => {
    const inputDom = document.getElementById('input') as HTMLInputElement;
    inputDom.select();
    document.execCommand('copy');
  };

  const copyTextarea = () => {
    const textareaDom = document.getElementById('textarea') as HTMLInputElement;
    textareaDom.select();
    document.execCommand('copy');
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
        <span className={style.textSpan}>Textarea</span>
        <textarea
          id="textarea"
          value={textareaText}
          onChange={(d) => setTextareaText(d.target.value)}
        ></textarea>
        <button className={style.textButton} onClick={() => copyTextarea()}>
          复制
        </button>
      </div>
    </div>
  );
};
