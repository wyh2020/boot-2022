import React, { useState } from 'react';
import { WorkSheet, read, utils, writeFile } from 'xlsx';
import * as dateFns from 'date-fns';
import * as lodash from 'lodash';
import 'react-data-grid/lib/styles.css';
import DataGrid, { Column } from 'react-data-grid';
import { genExportData } from './utils';

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

const sub8Hours = (date: any) =>
  date ? dateFns.format(new Date(dateFns.subHours(date, 0)), 'yyyy-MM-dd') : null;


const Divider = () => <div style={{ minHeight: 20, background: "linear-gradient(180deg,#3023ae,#53a0fd 40%,#51ecbf)", margin: "20px 0px" }}></div>;

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

function to_json(array: any[]) {
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
  return jsonData;
}

function clean_json(array: any[], key: string) {
  if(key === 'jira') {
    return array.map((d: any) => {
      const startActDate = sub8Hours(d['自定义字段(实际开始日期)']);
      const endActDate = sub8Hours(d['自定义字段(实际完成日期)']);
      const startPlanDate = sub8Hours(d['自定义字段(计划开始日期)']);
      const endPlanDate = sub8Hours(d['自定义字段(计划完成日期)']);
      const workHours = d['初始预估'] ? d['初始预估'] / 3600 : null
      return {
        姓名: d['经办人'],
        JIRA任务号: d['问题关键字'],
        '工作量(小时)': workHours,
        实际开始日期: startActDate,
        实际完成日期: endActDate,
        计划开始日期: startPlanDate,
        计划完成日期: endPlanDate,
      };
    })
  } else {
    return array.map((d: any) => {
      // 有打卡记录&不是周末 应出勤人天(小时) 为 8 小时
      const planWorkHour = d['出勤时间'] && !dateFns.isWeekend(d['出勤时间']) ? 8 : 0;
      return {
        姓名: d['人员'],
        日期: d['日期'],
        '应出勤人天(小时)': planWorkHour,
        '实际出勤人天(小时)': d['出勤时间'],
      };
    })
  }
}

/**
 * @param wb 
 * @param key 
 * @des workbook => json => workbook 目的是做数据转换
 * @returns 
 */
function genWbData(wb: any, key: string) {
  const sheetNames = wb.SheetNames;
  const workbook = utils.book_new();
  for (const sheetName of sheetNames) {
    const ws = wb.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(ws, { header: 1 });
    const newJsonData = to_json(jsonData);
    const cleanJsonData = clean_json(newJsonData, key)
    const newWs = utils.json_to_sheet(cleanJsonData);
    utils.book_append_sheet(workbook, newWs, sheetName);
  }
  return workbook;
}

export default () => {
  const [sheetNamesJira, setSheetNamesJira] = useState<string[]>([]);
  const [sheetNameJira, setSheetNameJira] = useState<string>('');
  const [wbDataJira, setWbDataJira] = useState<any>({});
  const [rowsJira, setRowsJira] = useState<any[]>([]);
  const [columnsJira, setColumnsJira] = useState<any[]>([]);

  const [sheetNamesDaka, setSheetNamesDaka] = useState<string[]>([]);
  const [sheetNameDaka, setSheetNameDaka] = useState<string>('');
  const [wbDataDaka, setWbDataDaka] = useState<any>({});
  const [rowsDaka, setRowsDaka] = useState<any[]>([]);
  const [columnsDaka, setColumnsDaka] = useState<any[]>([]);

  const [rowsAll, setRowsAll] = useState<any[]>([]);
  const [columnsAll, setColumnsAll] = useState<any[]>([]);

  const [allJsonList, setAllJsonList] = useState<any[]>([]);

  const chaiJieJira = (jiraData: any) => {
    let result: any = [];
    for (let i = 0; i < jiraData.length; i++) {
      const item = jiraData[i];
      const startActDate = item['实际开始日期'];
      const endActDate = item['实际完成日期'];
      let list: any = [];
      if (startActDate && endActDate) {
        const l = dateFns.eachDayOfInterval({
          start: new Date(`${startActDate} 00:00:00`),
          end: new Date(`${endActDate} 23:59:59`),
        });
        list = l.map((d) => ({
          '姓名': item['姓名'],
          '日期': dateFns.format(new Date(d), 'yyyy-MM-dd'),
          'JIRA任务号': item['JIRA任务号'],
          '工作量(小时)': +(item['工作量(小时)'] / l.length).toFixed(3),
        }));
      }
      result = result.concat(list);
    }
    return result;
  }

  const getAllJiraJsonData = (workbook: any) => {
    let data: any[] = [];
      // 循环文件中的每个表
      const sheetNames = workbook.SheetNames;
      for (let i = 0; i < sheetNames?.length; i++) {
        const sheet = workbook.Sheets[sheetNames[i]];
        const list = utils.sheet_to_json(sheet, { header: 1 });
        // 将同一个JIRA拆分为多个 根据实际开始 - 实际结束
        const newList = chaiJieJira(to_json(list));
        data = data.concat(newList);
      }
      return data;
  }

  const getAllDataJsonData = (workbook: any) => {
    let data: any[] = [];
      // 循环文件中的每个表
      const sheetNames = workbook.SheetNames;
      for (let i = 0; i < sheetNames?.length; i++) {
        const sheet = workbook.Sheets[sheetNames[i]];
        const list = utils.sheet_to_json(sheet, { header: 1 });
        data = data.concat(list);
      }
      return to_json(data);
  }

  const genAllData = () => {
    const allJiraJsonData = getAllJiraJsonData(wbDataJira);
    const allDakaJsonData = getAllDataJsonData(wbDataDaka);

    const allJsonData = allDakaJsonData.map((d: any) => {
      const jiraList = allJiraJsonData.filter((j) => j['姓名'] === d['姓名'] && j['日期'] === d['日期']);
      const jiraDay = jiraList.reduce((pre, cur) => {
        return pre + cur['工作量(小时)'];
      }, 0);
      d['JIRA工作量(小时)'] = jiraDay.toFixed(3);
      d['JIRA列表'] = jiraList.map(d => `${d['JIRA任务号']}(${d['工作量(小时)']})`).join('、');
      return d;
    });
    setAllJsonList(allJsonData);
    // 构建预览数据
    const workbookSheet = utils.json_to_sheet(allJsonData);
    const { rowsData, columnsData } = ws_to_rdg(workbookSheet);
    setRowsAll(rowsData);
    setColumnsAll(columnsData);
  }


  const upFileJira = async (d: any) => {
    const file = d.target.files[0];
    const data = await file.arrayBuffer();
    const wb = read(data, { type:"binary", cellDates: true });
    // 数据转换完之后 该干嘛就干嘛
    const newWorkbook = genWbData(wb, 'jira');
    const sheetNames = newWorkbook.SheetNames;
    const firstSheetName = sheetNames[0];
    const firstWorkbookSheet = newWorkbook.Sheets[firstSheetName];
    
    setWbDataJira(newWorkbook);
    setSheetNamesJira(sheetNames);
    setSheetNameJira(firstSheetName);

    const { rowsData, columnsData } = ws_to_rdg(firstWorkbookSheet);

    setRowsJira(rowsData);
    setColumnsJira(columnsData);
  };


  const upFileDaka = async (d: any) => {
    const file = d.target.files[0];
    const data = await file.arrayBuffer();
    const wb = read(data, { type:"binary", cellDates: true });
    // 数据转换完之后 该干嘛就干嘛
    const newWorkbook = genWbData(wb, 'daka');
    const sheetNames = newWorkbook.SheetNames;
    const firstSheetName = sheetNames[0];
    const firstWorkbookSheet = newWorkbook.Sheets[firstSheetName];
    
    setWbDataDaka(newWorkbook);
    setSheetNamesDaka(sheetNames);
    setSheetNameDaka(firstSheetName);

    const { rowsData, columnsData } = ws_to_rdg(firstWorkbookSheet);

    setRowsDaka(rowsData);
    setColumnsDaka(columnsData);
  };

  const toReviewData = () => {
    genAllData();
  }

  const downloadFile = () => {
    const newData = lodash.groupBy(allJsonList, '姓名');
    const workbook = utils.book_new();
    Object.keys(newData).map((d) => {
      const list = genExportData(newData[d]);
      const sheetName = d;
      const newWs = utils.json_to_sheet(list);
      utils.book_append_sheet(workbook, newWs, sheetName);
    });
    writeFile(workbook, "资源利用率&加班率.xlsx");
  };

  const onChangeSheet = (name: string, key: string) => {
    if(key === "daka"){
      const { rowsData, columnsData } = ws_to_rdg(wbDataDaka.Sheets[name]);
      setRowsDaka(rowsData);
      setColumnsDaka(columnsData);
      setSheetNameDaka(name);
    } else if(key === 'jira'){
      const { rowsData, columnsData } = ws_to_rdg(wbDataJira.Sheets[name]);
      setRowsJira(rowsData);
      setColumnsJira(columnsData);
      setSheetNameJira(name);
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label
        style={{
          textAlign: 'center',
          border: '1px dashed #b3b7c1',
          margin: '10px 0px',
          height: '35px',
          fontSize: '24px',
        }}
      >
        点击上传JIRA数据文件
        <input
          type="file"
          accept=".xls, .xlsx"
          onChange={(d) => upFileJira(d)}
          style={{ display: 'none' }}
        />
      </label>
      {sheetNamesJira?.length > 0 && (
        <div>
          {sheetNamesJira?.map((d) => {
            if (sheetNameJira === d) {
              return (
                <button style={{ margin: '10px 10px 10px 0px', color: 'red' }}>
                  {d}
                </button>
              );
            }
            return (
              <button
                style={{ margin: '10px 10px 10px 0px' }}
                onClick={() => onChangeSheet(d, "jira")}
              >
                {d}
              </button>
            );
          })}
        </div>
      )}

      <DataGrid
        columns={columnsJira}
        rows={rowsJira}
        renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
      />
      {rowsJira?.length > 0 && <span>{`共计${rowsJira?.length}条数据`}</span>}
      {/* 以上是JIRA数据 */}
      <Divider />
      {/* 以下是打卡数据 */}
      <label
        style={{
          textAlign: 'center',
          border: '1px dashed #b3b7c1',
          margin: '10px 0px',
          height: '35px',
          fontSize: '24px',
        }}
      >
        点击上传打卡数据文件
        <input
          type="file"
          accept=".xls, .xlsx"
          onChange={(d) => upFileDaka(d)}
          style={{ display: 'none' }}
        />
      </label>
      {sheetNamesDaka?.length > 0 && (
        <div>
          {sheetNamesDaka?.map((d) => {
            if (sheetNameDaka === d) {
              return (
                <button style={{ margin: '10px 10px 10px 0px', color: 'red' }}>
                  {d}
                </button>
              );
            }
            return (
              <button
                style={{ margin: '10px 10px 10px 0px' }}
                onClick={() => onChangeSheet(d, "daka")}
              >
                {d}
              </button>
            );
          })}
        </div>
      )}

      <DataGrid
        columns={columnsDaka}
        rows={rowsDaka}
        renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
      />
      {rowsDaka?.length > 0 && <span>{`共计${rowsDaka?.length}条数据`}</span>}

      <Divider />

      <button
        style={{ margin: '10px 0px', height: '40px', fontSize: '24px' }}
        onClick={() => toReviewData()}
        disabled={sheetNamesJira?.length === 0 || sheetNamesDaka?.length === 0}
      >
        预览数据
      </button>

      <DataGrid
        columns={columnsAll}
        rows={rowsAll}
        renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
      />
      {rowsAll?.length > 0 && <span>{`共计${rowsAll?.length}条数据`}</span>}

      <Divider />

      <button
        style={{ margin: '10px 0px', height: '40px', fontSize: '24px' }}
        onClick={() => downloadFile()}
        disabled={sheetNamesJira?.length === 0 || sheetNamesDaka?.length === 0}
      >
        点击导出数据
      </button>

    </div>
  );
};
