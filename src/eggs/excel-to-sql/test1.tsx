import React, { useState } from 'react';
import { WorkSheet, read, utils, writeFile } from 'xlsx';
import 'react-data-grid/lib/styles.css';
import DataGrid, { Column } from 'react-data-grid';
import { saveAs } from 'file-saver';
import style from './style.css';

type Row = any[];
type AOAColumn = Column<Row>;
type RowCol = { rowsData: Row[]; columnsData: AOAColumn[] };

function EmptyRowsRenderer() {
  return (
    <div style={{ textAlign: 'center', gridColumn: '1/-1' }}>
      暂无数据，请上传Excel文件
    </div>
  );
}

function ws_to_rdg(ws: WorkSheet): RowCol {
  const rows: any = utils.sheet_to_json(ws, { header: 1 });
  const range = utils.decode_range(ws['!ref'] || 'A1');
  const columns = Array.from({ length: range.e.c + 1 }, (_, i) => ({
    key: String(i),
    name: utils.encode_col(i),
  }));
  return { rowsData: rows, columnsData: columns };
}

function arrayify(rows: any[]): Row[] {
  return rows.map((row) => {
    let length = Object.keys(row).length;
    for (; length > 0; --length) if (row[length - 1] != null) break;
    return Array.from({ length, ...row });
  });
}

function rdg_to_ws(rows: Row[]): WorkSheet {
  return utils.aoa_to_sheet(arrayify(rows));
}

function getUniqArr(array: any, shopId: string) {
  const map: any = {};
  for (const arr of array) {
   // 获取商品Url
    const proUrl = arr['商品链接'];
    if (!map[proUrl]) {
      const defaultStr = 'INSERT INTO wyh_product_douyin_item (shop_id,pro_id,pro_name,pro_url,discount_price,market_price,create_by,used,cate_id,update_by,create_time,update_time,deleted_at) VALUES';
       // 获取商品id
      const proId = arr['商品链接']?.split('?')?.[1]?.split("=")?.[1];
      const proName = arr['商品标题'];
      const valueStr = `('${shopId}','${proId}','${proName}','${proUrl}',NULL,NULL,'admin','0000000000','0',NULL,'2022-10-03 22:31:00.0',NULL,NULL);`;
      map[proUrl] = { tableData: { ...arr, 商品链接: proUrl }, sqlData: `${defaultStr}${valueStr}` };
    }
  }
  const res = Object.values(map);
  return res;
}

function to_json(array: any[], shopId: string) {
  array = array.filter((d) => d);
  const headers = array[0];
  const jsonData: any[] = [];
  for (let i = 1, length = array.length; i < length; i++) {
    const row = array[i];
    const data: any = {};
    for (let x = 0; x < row.length; x++) {
      if (headers[x]) {
        data[headers[x]] = row[x];
      }
    }
    jsonData.push(data);
  }
  // 去重
  const res = getUniqArr(jsonData, shopId);
  return res;
}

function genWbData(wb: any, shopId: string) {
  const sheetNames = wb.SheetNames;
  const workbook = utils.book_new();
  let sqlDataList: any[] = [];
  for (const sheetName of sheetNames) {
    const ws = wb.Sheets[sheetName];
    // 处理数据
    const jsonData = utils.sheet_to_json(ws, { header: 1 });
    const mapData = to_json(jsonData, shopId);
    const mapValueData: any = Object.values(mapData); 
    
    const newJsonData = mapValueData.map((d: any) => d.tableData);
    console.log('newJsonData===', newJsonData);
    
    const sqlData = mapValueData.map((d: any) => d.sqlData);

    sqlDataList = sqlDataList.concat(sqlData);

    const newWs = utils.json_to_sheet(newJsonData);

    const rowsRes = ws_to_rdg(newWs);
    const workSheet = rdg_to_ws(rowsRes.rowsData);
    utils.book_append_sheet(workbook, workSheet, sheetName);
  }
  return { workbook, sqlDataList };
}

export default () => {
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [sheetName, setSheetName] = useState<string>('');
  const [wbData, setWbData] = useState<any>({});
  const [fileName, setFileName] = useState<string>('');
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [shopId, setShopId] = useState<string>('');
  const [sqlData, setSqlData] = useState<any[]>([]);

  const upFile = async (d: any) => {
    const file = d.target.files[0];
    setFileName(file.name);
    const data = await file.arrayBuffer();
    const wb = read(data);
    // 数据 去重
    const { workbook, sqlDataList } = genWbData(wb, shopId);
    setWbData(workbook);
    setSqlData(sqlDataList);
    const sheetNames = workbook.SheetNames;
    setSheetNames(sheetNames);
    setSheetName(sheetNames[0]);
    // 获取第一个工作表单的数据
    const ws = workbook.Sheets[sheetNames[0]];
    const { rowsData, columnsData } = ws_to_rdg(ws);
    console.log(rowsData, columnsData);
    setRows(rowsData);
    setColumns(columnsData);
  };

  const downloadFile = () => {
    var content = JSON.stringify(sqlData);
      var blob = new Blob(sqlData, {type: "text/plain;charset=utf-8"});
//       saveAs(blob, "save.json");
    saveAs(blob, `xxxx店铺.sql`);
  };

  const onChangeSheet = (name: string) => {
    const { rowsData, columnsData } = ws_to_rdg(wbData.Sheets[name]);
    setRows(rowsData);
    setColumns(columnsData);
    setSheetName(name);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={style.textDiv}>
        <span className={style.textSpan}>店铺ID(例如：jVjyvCSf)</span>
        <input
          id="input"
          value={shopId}
          onChange={(d) => setShopId(d.target.value)}
        ></input>
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
        点击上传文件
        <input
          type="file"
          accept=".xls, .xlsx"
          onChange={(d) => upFile(d)}
          style={{ display: 'none' }}
        />
      </label>
      {sheetNames?.length > 0 && (
        <div>
          {sheetNames?.map((d) => {
            if (sheetName === d) {
              return (
                <button style={{ margin: '10px 10px 10px 0px', color: 'red' }}>
                  {d}
                </button>
              );
            }
            return (
              <button
                style={{ margin: '10px 10px 10px 0px' }}
                onClick={() => onChangeSheet(d)}
              >
                {d}
              </button>
            );
          })}
        </div>
      )}
      <DataGrid
        columns={columns}
        rows={rows}
        renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
      />
      {rows?.length > 0 && <span>{`共计${rows?.length}条数据`}</span>}

      <button
        style={{ margin: '10px 0px', height: '40px', fontSize: '24px' }}
        onClick={() => downloadFile()}
        disabled={sheetNames?.length === 0}
      >
        点击导出(SQL语句)
      </button>
    </div>
  );
};
