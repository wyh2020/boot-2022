import React, { useState } from 'react';
import mergeImages from 'merge-images';
import { saveAs } from 'file-saver';

function base64toFile(dataURI: any, suffix: any) {
  const byteString = atob(dataURI.split(',')[1]);
  // 获取文件类型
  // const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: `image/${suffix}` });
}

export default () => {
  const [imgage1, setImgage1] = useState<any>('');
  const [imgage2, setImgage2] = useState<any>('');
  const [suffix, setSuffix] = useState<any>('');

  const upFile1 = async (d: any) => {
    const reader = new FileReader();
    const file = d.target.files[0];
    const fileName = file.name;
    const fileArr = fileName.split('.'); // 根据 . 来分割数组
    const suffixStr = fileArr[fileArr.length - 1]; // 取最后一个
    setSuffix(suffixStr);
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      (document as any).getElementById('imgage1').src = e.target.result;
      setImgage1(e.target.result);
    };
  };

  const upFile2 = async (d: any) => {
    const reader = new FileReader();
    const file = d.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      (document as any).getElementById('imgage2').src = e.target.result;
      setImgage2(e.target.result);
    };
  };

  const toMerge = () => {
    mergeImages([imgage1, imgage2], { format: `image/${suffix}` }).then(
      (b64: any) => ((document as any).getElementById('result').src = b64),
    );
  };

  const downloadFile = () => {
    const base64Data = (document as any).getElementById('result').src;
    const blob = base64toFile(base64Data, suffix);
    saveAs(blob, `合并后的图片.${suffix}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <img
          style={{ border: 'solid', marginRight: '5px' }}
          src=""
          id="imgage1"
          width={400}
          height={400}
        />
        <img
          style={{ border: 'solid', marginLeft: '5px' }}
          src=""
          id="imgage2"
          width={400}
          height={400}
        />
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
        点击上传第一张图片(任意格式)
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
        点击上传第二张图片(png格式)(覆盖在第一张图上面)
        <input
          type="file"
          accept="image/*"
          onChange={(d) => upFile2(d)}
          style={{ display: 'none' }}
        />
      </label>
      <div>
        <img
          style={{ border: 'solid', marginRight: '5px' }}
          src=""
          id="result"
          width={400}
          height={400}
        />
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
