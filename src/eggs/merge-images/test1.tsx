import React, { useState } from 'react';
import mergeImages from 'merge-images';


export default () => {
  const [imgage1, setImgage1] = useState<any>("");
  const [imgage2, setImgage2] = useState<any>("");

  const upFile1 = async (d: any) => {
    const reader = new FileReader();
    const file = d.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      document.getElementById("imgage1").src = e.target.result;
      setImgage1(e.target.result);
    }
  };

  const upFile2 = async (d: any) => {
    const reader = new FileReader();
    const file = d.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      document.getElementById("imgage2").src = e.target.result;
      setImgage2(e.target.result);
    }
  };

  const toMerge = () => {
    mergeImages([imgage1, imgage2])
    .then(b64 => document.getElementById('result').src = b64);
  };

  const downloadFile = () => {
    // 这里是获取到的图片base64编码,这里只是个例子哈，要自行编码图片替换这里才能测试看到效果
    const imgUrl = document.getElementById('result').src;
    // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
    if (window.navigator.msSaveOrOpenBlob) {
      var bstr = atob(imgUrl.split(',')[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      var blob = new Blob([u8arr])
      window.navigator.msSaveOrOpenBlob(blob, '合并后的图片' + '.' + 'png')
    } else {
      // 这里就按照chrome等新版浏览器来处理
      const a = document.createElement('a')
      a.href = imgUrl
      a.setAttribute('download', 'chart-download')
      a.click()
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <img style={{ border: "solid", marginRight: "5px" }} src="" id="imgage1" width={400} height={400} />
        <img style={{ border: "solid", marginLeft: "5px" }}src="" id="imgage2" width={400} height={400} />
      </div>
      <label
        style={{
          textAlign: 'center',
          border: '1px dashed #b3b7c1',
          margin: '10px 0px',
          height: '35px',
          fontSize: '24px',
        }}
      >
        点击上传背景图片
        <input
          type="file"
          accept="image/*"
          onChange={(d) => upFile1(d)}
          style={{ display: 'none' }}
        />
      </label>
      <label
        style={{
          textAlign: 'center',
          border: '1px dashed #b3b7c1',
          margin: '10px 0px',
          height: '35px',
          fontSize: '24px',
        }}
      >
        点击上传其他图片
        <input
          type="file"
          accept="image/*"
          onChange={(d) => upFile2(d)}
          style={{ display: 'none' }}
        />
      </label>
      <div>
        <img style={{ border: "solid", marginRight: "5px" }} src="" id="result" width={400} height={400} />
      </div>
      <button
        style={{ margin: '10px 0px', height: '40px', fontSize: '24px' }}
        onClick={() => toMerge()}
        disabled={!imgage1 || !imgage2}
      >
        合并
      </button>
      <button
        style={{ margin: '10px 0px', height: '40px', fontSize: '24px' }}
        onClick={() => downloadFile()}
        disabled={!imgage1 || !imgage2}
      >
        点击下载
      </button>
    </div>
  );
};
