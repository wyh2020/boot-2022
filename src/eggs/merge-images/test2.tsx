import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

function base64toFile(dataURI: any, suffix: any) {
  const byteString = atob(dataURI.split(',')[1]);
  // 获取文件类型
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: `image/${suffix}` });
}

const drawDefaultImage = () => {
  const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  if (canvas?.getContext('2d')) {
    const ctx = canvas.getContext('2d');
    ctx!.fillStyle = '#FFF';
    ctx!.fillRect(0, 0, 800, 800);
  }
};

const clearImage = () => {
  const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  if (canvas?.getContext('2d')) {
    const ctx = canvas.getContext('2d');
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
  }
};

export default () => {
  const [image1, setImage1] = useState<any>('');
  const [image2, setImage2] = useState<any>('');
  const [scaleValue, setScaleValue] = useState<any>(1);
  const [suffix, setSuffix] = useState<any>('');

  useEffect(() => {
    drawDefaultImage();
  }, []);

  const upFile1 = async (d: any) => {
    clearImage();
    const reader = new FileReader();
    const file = d.target.files[0];
    const fileName = file.name;
    const fileArr = fileName.split('.'); // 根据 . 来分割数组
    const suffixStr = fileArr[fileArr.length - 1]; // 取最后一个
    setSuffix(suffixStr);
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
        if (canvas?.getContext('2d')) {
          const ctx = canvas.getContext('2d');
          ctx!.clearRect(0, 0, 800, 800);
          setImage1(img);
          setScaleValue(1);
          ctx!.drawImage(img, 0, 0);
          if (image2) {
            const tempCanvas2 = document.getElementById(
              'tempCanvas2',
            ) as HTMLCanvasElement;
            ctx!.drawImage(tempCanvas2, 0, 0);
          }
        }
      };
    };
  };

  const toZoom = (scaleVal: any) => {
    clearImage();
    drawDefaultImage();
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    if (canvas?.getContext('2d')) {
      const ctx = canvas.getContext('2d');
      const scaleResult = scaleValue + scaleVal;
      setScaleValue(scaleResult);
      const imgWidth = image1.naturalWidth * scaleResult;
      const imgHeight = image1.naturalHeight * scaleResult;

      const sx = (image1.naturalWidth - imgWidth) / 2;
      const sy = (image1.naturalHeight - imgHeight) / 2;

      const tempCanvas1 = document.getElementById(
        'tempCanvas1',
      ) as HTMLCanvasElement;
      const tempCtx1 = tempCanvas1.getContext('2d');
      tempCtx1!.clearRect(0, 0, tempCanvas1.width, tempCanvas1.height);
      tempCanvas1.width = imgWidth;
      tempCanvas1.height = imgHeight;
      tempCtx1!.scale(scaleResult, scaleResult);
      tempCtx1!.drawImage(image1, 0, 0);

      ctx?.drawImage(tempCanvas1, sx, sy, imgWidth, imgHeight);

      if (image2) {
        const tempCanvas2 = document.getElementById(
          'tempCanvas2',
        ) as HTMLCanvasElement;
        ctx!.drawImage(tempCanvas2, 0, 0);
      }
    }
  };

  const upFile2 = async (d: any) => {
    const reader = new FileReader();
    const file = d.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
        if (canvas?.getContext('2d')) {
          const ctx = canvas.getContext('2d');
          setImage2(img);
          const tempCanvas2 = document.getElementById(
            'tempCanvas2',
          ) as HTMLCanvasElement;
          const tempCtx2 = tempCanvas2.getContext('2d');
          tempCtx2!.clearRect(0, 0, tempCanvas2.width, tempCanvas2.height);
          tempCtx2!.drawImage(img, 0, 0);
          if (image1) {
            const tempCanvas1 = document.getElementById(
              'tempCanvas1',
            ) as HTMLCanvasElement;

            const imgWidth = image1.naturalWidth * scaleValue;
            const imgHeight = image1.naturalHeight * scaleValue;

            const sx = (image1.naturalWidth - imgWidth) / 2;
            const sy = (image1.naturalHeight - imgHeight) / 2;

            const tempCtx1 = tempCanvas1.getContext('2d');
            tempCtx1!.clearRect(0, 0, tempCanvas1.width, tempCanvas1.height);
            tempCanvas1.width = imgWidth;
            tempCanvas1.height = imgHeight;
            tempCtx1!.scale(scaleValue, scaleValue);
            tempCtx1!.drawImage(image1, 0, 0);

            clearImage();
            drawDefaultImage();
            ctx?.drawImage(tempCanvas1, sx, sy, imgWidth, imgHeight);
          }

          ctx?.drawImage(tempCanvas2, 0, 0, 800, 800);
        }
      };
    };
  };

  const downloadFile = () => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const base64Data = canvas.toDataURL(`image/${suffix}`);
    const blob = base64toFile(base64Data, suffix);
    saveAs(blob, `合并后的图片.${suffix}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          alignContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ margin: 10, padding: 5 }}>
          <div
            style={{
              display: 'flex',
              alignContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{}}>
              <label
                style={{
                  textAlign: 'center',
                  margin: '10px 0px',
                  padding: '10px',
                  backgroundColor: '#fff',
                  borderRadius: '25px',
                }}
              >
                上传主图
                <input
                  type="file"
                  accept="image/*"
                  onChange={(d) => upFile1(d)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div
              style={{
                margin: 10,
                width: 100,
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <button
                style={{
                  borderRadius: '15px',
                }}
                onClick={() => toZoom(-0.1)}
                disabled={!image1}
              >
                缩小
              </button>
              <button
                style={{
                  borderRadius: '15px',
                }}
                onClick={() => toZoom(0.1)}
                disabled={!image1}
              >
                放大
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            margin: '10px',
          }}
        >
          <div>
            <label
              style={{
                textAlign: 'center',
                padding: '10px',
                borderRadius: '25px',
                backgroundColor: 'bisque',
              }}
            >
              上传边框
              <input
                type="file"
                accept="image/*"
                onChange={(d) => upFile2(d)}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
        <button
          style={{
            margin: '10px 0px',
            height: '40px',
            fontSize: '24px',
            borderRadius: '20px',
          }}
          onClick={() => downloadFile()}
          disabled={!image1 || !image2}
        >
          点击下载
        </button>
      </div>
      <div
        style={{
          backgroundColor: 'white',
          border: '0.5px solid',
          margin: 20,
          width: 800,
          height: 800,
        }}
      >
        <canvas id="myCanvas" width="800" height="800"></canvas>
        <canvas
          style={{ display: 'none' }}
          id="tempCanvas1"
          width="800"
          height="800"
        ></canvas>
        <canvas
          style={{ display: 'none' }}
          id="tempCanvas2"
          width="800"
          height="800"
        ></canvas>
      </div>
    </div>
  );
};
