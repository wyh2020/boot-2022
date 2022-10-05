import React, { useState } from 'react';

export default () => {
  const [baseInfo, setBaseInfo] = useState('');
  const [stockData, setStockData] = useState('');
  const [sqlStr, setSqlStr] = useState('');

  const toGenSql = () => {
    const baseInfoData = JSON.parse(baseInfo)?.data;
    const stockDataJson = JSON.parse(stockData)?.data;
    
    console.log("baseInfo====", baseInfo);
    console.log("stockData====", stockData);
    // 没有extra数据
    if(!baseInfoData?.extra){
      alert("没有extra数据");
      return;
    }

    // 没有stock数据
    if(!stockDataJson?.stock){
      alert("没有stock数据");
      return;
    }

    const proName = baseInfoData?.name;
    const proId = baseInfoData?.product_id;
    const shopName = baseInfoData?.shop_name;
    
    const firstCid = baseInfoData?.first_cid;
    const secondCid = baseInfoData?.second_cid;
    const thirdCid = baseInfoData?.third_cid;
    const categoryId = baseInfoData?.category_id;
    
    const img = baseInfoData?.img;
    const imgList = JSON.stringify(baseInfoData?.img_list);
    const productFormat = JSON.stringify(baseInfoData?.product_format);

    const qualityList = baseInfoData?.extra?.quality_list ? JSON.stringify(baseInfoData?.extra?.quality_list) : '';
    console.log("qualityList====", qualityList);
    
    const categoryDetail = JSON.stringify(baseInfoData?.extra?.category_detail);
    
    const specInfo = JSON.stringify(baseInfoData?.spec_info);
    const description = JSON.stringify(baseInfoData?.description);
    const discountPrice = baseInfoData?.discount_price;
    const marketPrice = baseInfoData?.market_price;

    const picMap = JSON.stringify(stockDataJson?.pic_map);
    const stock = JSON.stringify(stockDataJson?.stock);
    

    const insertSqlStr = `INSERT INTO wyh_product_douyin_item_info (pro_name,pro_id,shop_name,first_cid,second_cid,third_cid,category_id,img,used,img_list,product_format,quality_list,category_detail,pic_map,stock,spec_info,description,discount_price,market_price,create_by,update_by,create_time,update_time,deleted_at) VALUES
    ('${proName}','${proId}','${shopName}','${firstCid}','${secondCid}','${thirdCid}','${categoryId}',
    '${img}','0000000000','${imgList}','${productFormat}',${qualityList} ? ${qualityList} : NULL,'${categoryDetail}','${picMap}','${stock}','${specInfo}','${description}','${discountPrice}','${marketPrice}','admin',NULL,'2022-10-05 21:51:38.0',NULL,NULL);`;
    setSqlStr(insertSqlStr);
  };

  const toCopy = () => {
    // 创建输入框
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    // 隐藏此输入框
    textarea.style.position = 'absolute';
    textarea.style.clip = 'rect(0 0 0 0)';
    // 赋值
    textarea.value = sqlStr;
    // 选中
    textarea.select();
    // 复制
    document.execCommand('copy', true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <textarea
        id="baseInfo"
        placeholder="请输入baseInfo"
        style={{ width: '100%', height: 300, marginBottom: 20 }}
        value={baseInfo}
        onChange={(d) => setBaseInfo(d.target.value)}
      />
      <textarea
        id="stockData"
        placeholder="请输入stockData"
        style={{ width: '100%', height: 300 }}
        value={stockData}
        onChange={(d) => setStockData(d.target.value)}
      />
      <button
        onClick={() => toGenSql()}
        style={{ width: '100%', height: 45, margin: '20px 0px' }}
        disabled={!baseInfo && !stockData}
      >
        生成SQL语句
      </button>
      <button
        onClick={() => toCopy()}
        style={{ width: '100%', height: 45, marginBottom: 20 }}
        disabled={!sqlStr}
      >
        点击复制
      </button>
      <textarea
        id="sql"
        value={sqlStr}
        style={{ width: '100%', height: 400 }}
        disabled
      />
    </div>
  );
};
