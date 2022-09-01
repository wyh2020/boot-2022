import React, { useState } from 'react';

export default () => {
  const [jsonStr, setJsonStr] = useState('');
  const [sqlList, setSqlList] = useState<String[]>([]);
  const toGenSql = () => {
    const textareaDom = document.getElementById('textarea') as HTMLInputElement;
    const value = textareaDom.value;
    const list = JSON.parse(value).data;

    const sqlList = [];
    for (let i = 0; i < list.length; i++) {
      const sqlStr = `INSERT INTO wyh_product_douyin_item (shop_id,pro_id,pro_name,pro_url,discount_price,market_price,create_by,used,cate_id,update_by,create_time,update_time,deleted_at) VALUES ('LdZrZrBe','${list[i].product_id}','${list[i].name}','https://haohuo.jinritemai.com/views/product/detail?id=${list[i].product_id}','${list[i].discount_price}','${list[i].market_price}','admin','0000000000','${list[i].category_leaf_id}',NULL,'2022-08-31 22:31:00.0',NULL,NULL);`;
      sqlList.push(sqlStr);
    }
    setSqlList(sqlList);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <textarea
        id="textarea"
        style={{ width: '100%', height: 400 }}
        value={jsonStr}
        onChange={(d) => setJsonStr(d.target.value)}
      />
      <button
        onClick={() => toGenSql()}
        style={{ width: '100%', height: 45, margin: '20px 0px' }}
        disabled={!jsonStr}
      >
        生成SQL语句
      </button>
      <textarea
        id="sql"
        value={sqlList.join('\n')}
        style={{ width: '100%', height: 400 }}
        disabled
      />
    </div>
  );
};
