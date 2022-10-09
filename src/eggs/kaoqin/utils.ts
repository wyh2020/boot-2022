/**
 * 得到uuid
 */
let uid = Date.now();

export function getUid() {
  uid += 1;
  return uid;
}

export function getUidStr() {
  return getUid().toString(36);
}

export const genExportData = (list: any[]) => {
  if (list?.length === 0) return [];

  return (list || []).map((l) => {
    const sourceRate =
    l['JIRA工作量(小时)'] && l['应出勤人天(小时)'] ? `${((l['JIRA工作量(小时)'] / (l['应出勤人天(小时)'])) * 100).toFixed(2)}%` : '';
    const jiabanRate =
    l['实际出勤人天(小时)'] && l['应出勤人天(小时)'] ? `${((l['实际出勤人天(小时)'] / l['应出勤人天(小时)']) * 100).toFixed(2)}%` : '';
    return {
      姓名: l['姓名'],
      日期: `${l['日期']}`,
      '应出勤人天(小时)': l['应出勤人天(小时)'],
      '实际出勤人天(小时)': l['实际出勤人天(小时)'],
      'JIRA工作量(小时)': l['JIRA工作量(小时)'],
      'JIRA列表': l['JIRA列表'],
      资源利用率: sourceRate,
      加班率: jiabanRate,
    };
  });
};
