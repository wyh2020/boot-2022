import React, { useState } from 'react';

interface JsonParam {
  token?: string;
  bogus?: string;
  cookie?: string;
  msToken?: string;
  signature?: string;
  userName?: string;
}

export default () => {
  const [urlStr, setUrlStr] = useState('');
  const [cookeiStr, setCookeiStr] = useState('');
  const [jsonParam, setJsonParam] = useState<JsonParam>({});
  const toGenJsonParam = () => {
    const urlStrDom = document.getElementById('usrStr') as HTMLInputElement;
    const urlStrDomValue = urlStrDom.value;
    const urlStrDomQueryStr = urlStrDomValue?.split('?')[1];
    const params = urlStrDomQueryStr?.split('&');

    const cookieStrDom = document.getElementById(
      'cookieStr',
    ) as HTMLInputElement;
    const cookieStrDomValue = cookieStrDom.value;

    let result = { userName: 'dou001', cookie: cookieStrDomValue } as JsonParam;
    for (let i = 0; i < params.length; i++) {
      if (params[i].indexOf('token') >= 0) {
        result.token = params[i]?.split('=')?.[1];
      }
      if (params[i].indexOf('msToken') >= 0) {
        result.msToken = params[i]?.split('=')?.[1];
      }
      if (params[i].indexOf('Bogus') >= 0) {
        result.bogus = params[i]?.split('=')?.[1];
      }
      if (params[i].indexOf('_signature') >= 0) {
        result.signature = params[i]?.split('=')?.[1];
      }
    }
    setJsonParam(result);
  };

  const toCopy = () => {
    // 创建输入框
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    // 隐藏此输入框
    textarea.style.position = 'absolute';
    textarea.style.clip = 'rect(0 0 0 0)';
    // 赋值
    textarea.value = JSON.stringify(jsonParam, null, 4);
    // 选中
    textarea.select();
    // 复制
    document.execCommand('copy', true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <textarea
        id="usrStr"
        style={{ width: '100%', height: 150, marginBottom: 20 }}
        value={urlStr}
        placeholder="请输入请求URL"
        onChange={(d) => setUrlStr(d.target.value)}
      />
      <textarea
        id="cookieStr"
        style={{ width: '100%', height: 150, marginBottom: 20 }}
        placeholder="请输入Cookie"
        value={cookeiStr}
        onChange={(d) => setCookeiStr(d.target.value)}
      />
      <button
        onClick={() => toGenJsonParam()}
        style={{ width: '100%', height: 45, marginBottom: 20 }}
        disabled={!urlStr && !cookeiStr}
      >
        生成JSON格式数据
      </button>
      <button
        onClick={() => toCopy()}
        style={{ width: '100%', height: 45, marginBottom: 20 }}
        disabled={!jsonParam.token && !jsonParam.cookie}
      >
        点击复制
      </button>
      <textarea
        id="json"
        value={JSON.stringify(jsonParam, null, 4)}
        style={{ width: '100%', height: 400 }}
        disabled
      />
    </div>
  );
};
